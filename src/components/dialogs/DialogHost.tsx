"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { FullMenuDialog } from "@/components/dialogs/FullMenuDialog";
import { InfoDialog } from "@/components/dialogs/InfoDialog";
import { PrivateDiningDialog } from "@/components/dialogs/PrivateDiningDialog";
import { MobileNavDialog } from "@/components/dialogs/MobileNavDialog";

export function DialogHost() {
  const { dialog, closeDialog } = useSite();
  if (!dialog) return null;

  switch (dialog.name) {
    case "menu":
      return <FullMenuDialog initialTab={dialog.tab} onClose={closeDialog} />;
    case "philosophy":
    case "privacy":
    case "terms":
      return <InfoDialog kind={dialog.name} onClose={closeDialog} />;
    case "private-dining":
      return <PrivateDiningDialog onClose={closeDialog} />;
    case "nav":
      return <MobileNavDialog onClose={closeDialog} />;
    default:
      return null;
  }
}
