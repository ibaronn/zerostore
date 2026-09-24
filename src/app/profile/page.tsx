import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import ProfileDashboard from "@/components/profile-dashboard";

export const metadata: Metadata = { title: "حسابي | ZERO STORE" };

export default async function ProfilePage({ searchParams }: { searchParams: { tab?: string } }) {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 lg:px-6">
      <ProfileDashboard initialTab={searchParams.tab || "ads"} />
    </section>
  );
}