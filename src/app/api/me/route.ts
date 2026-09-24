import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicUser } from "@/lib/serialize";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  const [listingCount, chatCount, favoriteCount, views] = await Promise.all([
    prisma.listing.count({ where: { userId: user.id } }),
    prisma.chat.count({ where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] } }),
    prisma.favorite.count({ where: { userId: user.id } }),
    prisma.listing.aggregate({ where: { userId: user.id }, _sum: { views: true } }),
  ]);
  return NextResponse.json({
    user: publicUser(user),
    stats: {
      listingCount,
      chatCount,
      favoriteCount,
      totalViews: views._sum.views ?? 0,
    },
  });
}