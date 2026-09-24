import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import ChatThread from "@/components/chat-thread";

export const metadata: Metadata = { title: "المحادثة | ZERO STORE" };

export default async function ChatThreadPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
      <ChatThread chatId={params.id} meId={user.id} />
    </section>
  );
}