import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Listing, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { imageList } from "@/lib/images";
import { makeSlug } from "@/lib/format";
import { publicUser } from "@/lib/serialize";

const listSchema = z.object({
  title: z.string().min(4).max(120),
  description: z.string().min(10).max(4000),
  price: z.coerce.number().positive().max(1_000_000_000),
  negotiable: z.boolean().optional().default(true),
  condition: z.enum(["new", "used", "refurb"]).default("used"),
  category: z.string().min(1),
  city: z.string().min(1),
  images: z.array(z.string().url()).max(12).optional().default([]),
});

type SellerPick = Pick<User, "id" | "name" | "avatar" | "storeName" | "phone" | "city">;

function serialize(listing: Listing & { user: SellerPick }) {
  const { user, ...rest } = listing;
  return {
    ...rest,
    images: imageList(listing.images),
    user: publicUser(user as User),
  };
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const perPage = 24;
  const q = sp.get("q") ?? "";
  const category = sp.get("category") ?? "";
  const city = sp.get("city") ?? "";
  const min = sp.get("min");
  const max = sp.get("max");
  const sort = sp.get("sort") ?? "new";
  const mine = sp.get("mine") === "1";
  const favorites = sp.get("favorites") === "1";
  const user = await getCurrentUser();

  const where: Record<string, unknown> = {};
  if (mine) {
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    where.userId = user.id;
  } else {
    where.status = "active";
  }
  if (favorites) {
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    where.favorites = { some: { userId: user.id } };
  }
  if (q) where.title = { contains: q };
  if (category) where.category = category;
  if (city) where.city = city;
  if (min) where.price = { ...(where.price as object), gte: Number(min) };
  if (max) where.price = { ...(where.price as object), lte: Number(max) };

  const orderBy: Record<string, string> =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : sort === "views"
          ? { views: "desc" }
          : { createdAt: "desc" };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { user: { select: { id: true, name: true, avatar: true, storeName: true, phone: true, city: true } } },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings: listings.map((l) => serialize(l as Listing & { user: SellerPick })),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / perPage)),
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "سجّل الدخول أولاً" }, { status: 401 });
  try {
    const body = listSchema.parse(await req.json());
    const listing = await prisma.listing.create({
      data: {
        title: body.title,
        slug: makeSlug(),
        description: body.description,
        price: body.price,
        negotiable: body.negotiable,
        condition: body.condition,
        category: body.category,
        city: body.city,
        images: body.images.filter((i) => i.startsWith("/") || i.startsWith("http")).join("|"),
        userId: user.id,
      },
    });
    return NextResponse.json({ listing: serialize(listing as Listing & { user: SellerPick }) }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "تأكد من صحة البيانات المدخلة" }, { status: 400 });
    }
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}