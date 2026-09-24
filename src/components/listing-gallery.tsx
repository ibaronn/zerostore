"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const list = images.length ? images : [];
  const [active, setActive] = useState(0);
  const [error, setError] = useState<Record<number, boolean>>({});
  const [mainError, setMainError] = useState(false);

  if (!list.length) {
    return (
      <div className="grid aspect-[4/3] w-full place-items-center rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        <ImageOff className="h-14 w-14 opacity-60" />
      </div>
    );
  }

  const main = list[active];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-card">
        {!mainError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={main}
            alt={title}
            onError={() => setMainError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-600 to-brand-700 text-white">
            <ImageOff className="h-14 w-14 opacity-60" />
          </div>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-ink/55 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {active + 1} / {list.length}
        </span>
      </div>

      {list.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setActive(i);
                setMainError(false);
              }}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === active ? "border-brand-600 shadow-glow-sm" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {!error[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="h-full w-full object-cover" onError={() => setError((e) => ({ ...e, [i]: true }))} />
              ) : (
                <span className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-600 to-brand-700 text-white">
                  <ImageOff className="h-5 w-5" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}