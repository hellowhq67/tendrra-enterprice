import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";


export function BentoGridSecondDemo() {
  return (
    <BentoGrid className="max-w-4xl  mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}

        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);
const items = [
  {
    title: "AI-Powered Business Research Playground – Tendrra.com",
    description:
      "Boost your business growth with Tendrra’s advanced AI Research Playground. Explore data-driven insights, market trends, and competitor analysis to make smart decisions faster. Ideal for business owners and content creators seeking innovation.",
    header: <Skeleton />,
    className: "md:col-span-2 bg-black",
  },
  {
    title: "B2B Lead Generation Agent – Automate Client Acquisition",
    description:
      "Tendrra’s B2B Lead Generation AI Agent helps you discover high-converting leads with zero manual effort. Find, qualify, and reach potential clients effortlessly. Best for sales teams, startups, and growth-focused businesses.",
    header: <Skeleton />,
    className: "md:col-span-1 bg-black",
  },
  {
    title: "AI Shorts Generator for YouTube – Create Viral Content Instantly",
    description:
      "Create engaging YouTube Shorts in seconds with Tendrra’s AI-powered video generator. Perfect for content creators, influencers, and marketers looking to grow YouTube presence and engagement through smart automation.",
    header: <Skeleton />,
    className: "md:col-span-1 bg-black",
  },
  {
    title: "Email Automation & AI-Powered Social Media Marketing",
    description:
      "Tendrra’s AI agents help you automate LinkedIn and Instagram posts, send direct messages (DMs), and manage personalized email campaigns. Save time and drive better engagement with intelligent marketing automation.",
    header: <Skeleton />,
    className: "md:col-span-2 bg-black",
  },
];
