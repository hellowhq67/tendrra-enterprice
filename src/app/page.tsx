import { BentoGridSecondDemo } from "@/components/Grid/grid-layout";
import { Hero } from "@/components/Hero/hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Tabs } from "@/components/ui/tabs";
import { navItems } from "@/data";
import { FeaturesSectionDemo } from "@/components/Feturead/feature";

import React from "react";
import { HeroParallaxDemo } from "@/components/Hero/heroperalax";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GlowingEffectDemo } from "@/components/Grid/grid-items";
import { GridRow } from "@/components/Grid/grid-row";
import { InfiniteMovingCardsDemo } from "@/components/Feturead/infinitecards";
import { CTASection } from "@/components/Hero/cta-sec";
import { Footer } from  "@/components/Hero/footer"

const page = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <FloatingNav navItems={navItems} />
      <Hero />
      <GridRow />
      <GlowingEffectDemo />

      <FeaturesSectionDemo />

      <CTASection />
      <Footer/>
    </main>
  );
};

export default page;
