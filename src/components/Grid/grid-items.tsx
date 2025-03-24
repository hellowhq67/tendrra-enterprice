"use client";

import { Box, ChartAreaIcon, ChartNoAxesCombined, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion } from "framer-motion"
import { IconGrowth } from "@tabler/icons-react";
export function GlowingEffectDemo() {
  return (
    <div className="h-screen mt-10">
  <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
    <GridItem
      area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
      icon={<ChartAreaIcon />}
      title="Unlock Your Future Career Growth"
      description="A powerful platform for everyone—from learners to business owners—empowering you to succeed."
    />

    <GridItem
      area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
      icon={<Settings className="h-4 w-4 text-neutral-400" />}
      title="Smart AI Automation"
      description="From content creation to email automation, our AI tools handle tedious tasks so you can focus on growth. Start free and scale with flexible pay-as-you-go options."
    />

    <GridItem
      area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
      icon={<Lock className="h-4 w-4 text-neutral-400" />}
      title="Secure & Scalable AI"
      description="Enterprise-level security ensures your data stays safe, while our AI helps you accelerate your business. Choose your plan: Free or pay-as-you-go."
    />

    <GridItem
      area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
      icon={<Sparkles className="h-4 w-4 text-neutral-400" />}
      title="Tendrra for Creators"
      description="Create, schedule, and manage posts for your social media platforms effortlessly with AI-powered tools. Enjoy free access or explore pay-as-you-go options."
    />

    <GridItem
      area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
      icon={<Search className="h-4 w-4 text-neutral-400" />}
      title="AI-Driven Research & Insights"
      description="Instant market analysis, competitor research, and trend insights to help you stay ahead. Get started free or unlock more with our pay-as-you-go plan."
    />
  </ul>
</div>

  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2.5xl border  p-2  md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6  shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2 ">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-black text-white">
                {title}
              </h3>
              <h2
                className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm/[1.125rem] 
              md:text-base/[1.375rem]   text-neutral-400"
              >
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
