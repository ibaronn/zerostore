import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import ChatList from "@/components/chat-list";

export const metadata: Metadata = { title: "محادثاتي | ZERO STORE" };

export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-brand-600">التفاوض الفوري</p>
        <h1 className="font-cairo mt-2 text-3xl font-black text-slate-900">محادثاتي</h1>
        <p className="mt-2 text-sm font-bold text-slate-500">تابع كل مفاوضاتك مع البائعين والمشترين في مكان واحد.</p>
      </div>
      <ChatList me={{ id: user.id, name: user.name }} />
    </section>
  );
}