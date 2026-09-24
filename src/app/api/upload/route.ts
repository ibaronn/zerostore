import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
  "application/octet-stream",
  "binary/octet-stream",
];
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"];
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "لم يتم إرسال ملف" }, { status: 400 });
    }
    const nameMatch = String(file.name || "").split(".");
    const extFromName = nameMatch.length > 1 ? nameMatch.pop()!.toLowerCase() : "";
    const valid =
      ALLOWED.includes(file.type) || (extFromName && ALLOWED_EXT.includes(extFromName));
    if (!valid) {
      return NextResponse.json({ error: "صيغة الصورة غير مدعومة" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "حجم الصورة يتجاوز 8 ميجابايت" }, { status: 400 });
    }
    const ext =
      extFromName && ALLOWED_EXT.includes(extFromName)
        ? extFromName
        : file.type === "image/jpeg"
          ? "jpg"
          : file.type.split("/")[1] || "img";
    const name = `${randomUUID()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, name), buf);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch {
    return NextResponse.json({ error: "فشل رفع الصورة" }, { status: 500 });
  }
}