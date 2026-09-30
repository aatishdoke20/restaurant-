"use client";

import { Dialog, DialogClose } from "@/components/ui/Dialog";
import { LEGAL, PHILOSOPHY } from "@/content/site";

type Kind = "philosophy" | "privacy" | "terms";

const COPY: Record<Kind, { eyebrow: string; title: string }> = {
  philosophy: { eyebrow: "The Kitchen", title: "Our Philosophy" },
  privacy: { eyebrow: "Khaana", title: "Privacy" },
  terms: { eyebrow: "Khaana", title: "Terms" },
};

export function InfoDialog({ kind, onClose }: { kind: Kind; onClose: () => void }) {
  const titleId = `info-dialog-${kind}`;
  const copy = COPY[kind];

  return (
    <Dialog labelledBy={titleId} onClose={onClose} variant="center">
      {(close) => (
        <div className="p-7 sm:p-12">
          <div className="flex items-start justify-between gap-6" data-dialog-item="">
            <p className="eyebrow pt-3 text-ivory/60">{copy.eyebrow}</p>
            <DialogClose onClick={close} className="-mr-2" />
          </div>
          <h2 id={titleId} data-dialog-item="" className="display-m mt-5 text-ivory">
            {copy.title}
          </h2>
          {kind === "philosophy" ? (
            <ol className="mt-10 space-y-7">
              {PHILOSOPHY.map((item, i) => (
                <li key={item.title} data-dialog-item="" className="grid grid-cols-[2.75rem_1fr] gap-4 border-t border-ivory/10 pt-6">
                  <span className="meta pt-1 text-gold-soft">0{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-[1.7rem] font-medium leading-none text-ivory">{item.title}</h3>
                    <p className="body-copy mt-3">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-8 space-y-4">
              {LEGAL[kind].map((paragraph) => (
                <p key={paragraph} data-dialog-item="" className="body-copy">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
