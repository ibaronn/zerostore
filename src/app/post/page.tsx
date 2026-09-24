import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle, ShieldCheck, Wallet, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import PostForm, { type PostInitial } from "@/components/post-form";

export const metadata = { title: "أضف إعلانك | ZERO STORE" };

export default async function PostPage({ searchParams }: { searchParams: { id?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/post");

  let initial: PostInitial = {
    title: "",
    description: "",
    price: 0,
    negotiable: true,
    condition: "used",
    category: "",
    city: user.city ?? "",
    images: [],
  };
  let isEdit = false;

  if (searchParams.id) {
    const existing = await prisma.listing.findUnique({ where: { id: searchParams.id } });
    if (!existing || existing.userId !== user.id) redirect("/profile");
    initial = {
      id: existing.id,
      title: existing.title,
      description: existing.description,
      price: existing.price,
      negotiable: existing.negotiable,
      condition: existing.condition,
      category: existing.category,
      city: existing.city,
      images: (existing.images || "").split("|").filter(Boolean),
    };
    isEdit = true;
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-brand-50 to-[#f4f6f5] py-12 text-slate-900">
        <div className="pointer-events-none absolute -top-24 start-1/3 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 lg:px-6">
          <p className="text-xs font-black uppercase tracking-widest text-brand-600">
            {isEdit ? "تعديل الإعلان" : "إعلان جديد"}
          </p>
          <h1 className="font-cairo mt-2 text-3xl font-black sm:text-4xl">
            {isEdit ? (
              <>
                عدّل <span className="text-gradient">إعلانك</span>
              </>
            ) : (
              <>
                ضع منتجك أمام <span className="text-gradient">الجميع</span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-xl text-sm font-bold text-slate-500">
            املأ التفاصيل بدقة وأضف صوراً واضحة لتحصل على مشترين أسرع.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Tip icon={<Wallet className="h-5 w-5" />} title="بلا عمولة" desc="النشر مجاني 100%" />
          <Tip icon={<ShieldCheck className="h-5 w-5" />} title="حساب آمن" desc="معلوماتك محمية" />
          <Tip icon={<Zap className="h-5 w-5" />} title="نشر فوري" desc="يظهر للجميع مباشرة" />
        </div>
        <PostForm initial={initial} isEdit={isEdit} />
        <p className="mt-6 text-center text-xs font-bold text-slate-400">
          بنشر إعلانك فأنت توافق على أن البيع يتم بين الأفراد، وزيرو ستور منصة وسيطة فقط.
          <Link href="/" className="mx-1 text-brand-600 hover:underline">عرض سياسة الاستخدام</Link>
        </p>
      </section>
    </>
  );
}

function Tip({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        {icon}
      </div>
      <p className="font-cairo mt-2 text-sm font-extrabold text-slate-800">{title}</p>
      <p className="text-[11px] font-bold text-slate-400">{desc}</p>
    </div>
  );
}