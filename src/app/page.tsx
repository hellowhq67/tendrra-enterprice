import { BentoGridSecondDemo } from '@/components/Grid/grid-layout';
import { Hero } from '@/components/Hero/hero';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { Tabs } from '@/components/ui/tabs';
import { navItems } from "@/data";
import {  FeaturesSectionDemo} from '@/components/Feturead/feature';
import {  FeaturesSectionDemo2} from '@/components/Feturead/app-featured';
import React from 'react';
import { HeroParallaxDemo } from '@/components/Hero/heroperalax';

const page = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <FloatingNav navItems={navItems}/>
      <Hero/>
      <FeaturesSectionDemo2/>
      <HeroParallaxDemo/>
      <FeaturesSectionDemo/>
      <BentoGridSecondDemo/>
    </main>
  );
};

export default page;