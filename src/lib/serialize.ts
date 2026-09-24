import type { User } from "@prisma/client";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  bio: string | null;
  storeName: string | null;
  avatar: string | null;
  banner: string | null;
  createdAt: Date;
};

export function publicUser(u: User): PublicUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    city: u.city,
    bio: u.bio,
    storeName: u.storeName,
    avatar: u.avatar,
    banner: u.banner,
    createdAt: u.createdAt,
  };
}