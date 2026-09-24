import { createHash, randomInt } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";

export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_SECONDS = 45;

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "shopely-super-secret-change-me");

function pepper() {
  return process.env.OTP_SECRET || "zerostore-otp-pepper";
}

export function hashOtp(code: string) {
  return createHash("sha256").update(`${code}:${pepper()}`).digest("hex");
}

export function generateCode() {
  return String(randomInt(0, 1000000)).padStart(6, "0");
}

const VERIFY_TOKEN_TTL = "15m";

export async function signVerifiedPhone(phone: string) {
  return await new SignJWT({ purpose: "phone-verify", phone })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(VERIFY_TOKEN_TTL)
    .sign(secret);
}

export async function verifyVerifiedPhone(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.purpose !== "phone-verify") return null;
    return typeof payload.phone === "string" ? payload.phone : null;
  } catch {
    return null;
  }
}

export async function storeOtp(phone: string, code: string) {
  const codeHash = hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  await prisma.otpCode.upsert({
    where: { phone },
    create: { phone, codeHash, expiresAt },
    update: { codeHash, expiresAt, attempts: 0, used: false },
  });
}

export type OtpRow = {
  expiresAt: Date;
  attempts: number;
  used: boolean;
  codeHash: string;
};

export async function getOtp(phone: string): Promise<OtpRow | null> {
  return await prisma.otpCode.findUnique({ where: { phone } });
}

export async function markOtpUsed(phone: string) {
  await prisma.otpCode.update({ where: { phone }, data: { used: true } });
}

export async function bumpOtpAttempts(phone: string) {
  await prisma.otpCode.update({ where: { phone }, data: { attempts: { increment: 1 } } });
}