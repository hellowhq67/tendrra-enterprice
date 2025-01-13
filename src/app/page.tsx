
import { BentoGridSecondDemo } from '@/components/Grid/grid-layout';
import { Hero } from '@/components/Hero/hero'
import { FloatingNav } from '@/components/ui/floating-navbar'
import { Tabs } from '@/components/ui/tabs';
import { navItems } from "@/data";
import React from 'react'
const page =()=>{
  return(
    <main  className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
    <FloatingNav navItems={navItems}/>
    <Hero/>
    <BentoGridSecondDemo/>
    </main>
  )
}
export default page