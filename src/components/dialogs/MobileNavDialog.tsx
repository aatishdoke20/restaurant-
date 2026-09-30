"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { Dialog, DialogClose } from "@/components/ui/Dialog";
import { NAV_ITEMS, RESTAURANT } from "@/content/site";

export function MobileNavDialog({ onClose }: { onClose: () => void }) {
  const { scrollTo, reserve, afterDialogClose } = useSite();

  return (
    <Dialog labelledBy="mobile-nav-title" onClose={onClose} variant="full">
      {(close) => {
        const go = (href: string) => {
          afterDialogClose(() => (href === "#reserve" ? reserve() : scrollTo(href)));
          close();
        };
        return (
          <div className="flex min-h-full flex-col px-[var(--pad)] pb-10 pt-3">
            <h2 id="mobile-nav-title" className="sr-only">
              Site navigation
            </h2>
            <div className="flex h-[62px] items-center justify-between" data-dialog-item="">
              <p className="font-serif text-[1.3rem] font-medium tracking-[0.5em] text-ivory">KHAANA</p>
              <DialogClose onClick={close} />
            </div>
            <nav aria-label="Mobile" className="mt-12">
              <ul>
                {NAV_ITEMS.map((item, i) => (
                  <li key={item.id} data-dialog-item="" className="border-b border-ivory/10">
                    <a
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        go(item.href);
                      }}
                      className="group flex items-baseline justify-between py-5"
                    >
                      <span className="display-m text-ivory transition-[translate] duration-500 group-hover:translate-x-1">
                        {item.label}
                      </span>
                      <span className="meta text-ivory/40">0{i + 1}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto pt-14" data-dialog-item="">
              <p className="meta leading-[2] text-ivory/60">
                {RESTAURANT.addressLines[0]}
                <br />
                {RESTAURANT.addressLines[1]}
                <br />
                {RESTAURANT.hoursShort}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
                <a href={RESTAURANT.phoneHref} className="meta text-ivory">
                  {RESTAURANT.phone}
                </a>
                <a href={RESTAURANT.instagram} target="_blank" rel="noopener noreferrer" className="meta text-ivory">
                  Instagram<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        );
      }}
    </Dialog>
  );
}
