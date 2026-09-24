"use client";

import { useEffect, useRef, useState } from "react";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1200;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(value * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="font-cairo text-4xl font-extrabold tracking-tight text-brand-700 md:text-5xl">
      {n.toLocaleString("en-US")}{suffix}
    </span>
  );
}

const STATS = [
  { emoji: "📦", value: 120, suffix: " ألف+", label: "إعلان منشور" },
  { emoji: "👥", value: 48, suffix: " ألف+", label: "مستخدم نشط" },
  { emoji: "🤝", value: 96, suffix: "%", label: "رضا عمليات التفاوض" },
  { emoji: "🆓", value: 0, suffix: " د.ل", label: "عمولة على البيع" },
];

export default function StatsBand() {
  return (
    <section className="border-y border-slate-200 bg-white py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center lg:grid-cols-4 lg:divide-x lg:divide-slate-100">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-2">
            <span className="bg-slate-100 px-3 py-1.5 text-2xl leading-none" aria-hidden>
              {s.emoji}
            </span>
            <Counter value={s.value} suffix={s.label.includes("عمولة") ? " د.ل" : s.suffix} />
            <p className="text-sm font-semibold text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}