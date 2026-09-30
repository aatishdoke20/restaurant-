import { SiteProvider } from "@/components/providers/SiteProvider";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MenuShowcase } from "@/components/MenuShowcase";
import { SignatureDish } from "@/components/SignatureDish";
import { ChefTable } from "@/components/ChefTable";
import { SpiceTrail } from "@/components/SpiceTrail";
import { KitchenSection } from "@/components/KitchenSection";
import { SeasonalMenu } from "@/components/SeasonalMenu";
import { DiningExperience } from "@/components/DiningExperience";
import { Gatherings } from "@/components/Gatherings";
import { Reservation } from "@/components/Reservation";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";
import { DialogHost } from "@/components/dialogs/DialogHost";
import { CustomCursor } from "@/components/CustomCursor";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <SiteProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <div id="journey" className="relative isolate overflow-x-clip">
        <main id="main">
          <Hero />
          <MenuShowcase />
          <SignatureDish />
          <ChefTable />
          <SpiceTrail />
          <KitchenSection />
          <SeasonalMenu />
          <DiningExperience />
          <Gatherings />
          <Reservation />
          <LocationSection />
        </main>
        <Footer year={year} />
      </div>
      <DialogHost />
      <CustomCursor />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </SiteProvider>
  );
}
