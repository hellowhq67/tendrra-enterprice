import React from "react";
import { Spotlight } from "../ui/Spotlight";
import { div } from "framer-motion/client";
import { FloatingNav } from "../ui/floating-navbar";
import { SparklesCore } from "../ui/sparkles";
import { Button } from "../ui/moving-border";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import Link from "next/link";

export function Hero() {
  return (
    <div className="w-full  h-screen">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="black"
        />
        <Spotlight
          className="left-80 top-28 h-[80vh] w-[50vw]"
          fill="#030637"
        />
      </div>

      <div className="h-[100vh] w-full   bg-grid-white/[0.2]   relative flex items-center justify-center">
        <div className="h-[40rem] relative w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
          <div className="w-full absolute inset-0 h-screen">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>
          <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20">
            Your Digital Success Starts Here
          </h1>

          <p className="text-white text-2xl text-center">
            Web design, marketing solutions, <br />
            and ready-to-use templates to help your business thrive in the
            digital world.
          </p>

          <div className="flex items-center gap-2 mt-2">
            <HoverBorderGradient
              containerClassName="rounded-md"
              as="button"
              className="bg-black  text-white flex items-center space-x-2"
            >
              <Link href={"/sing-up"}>getting started</Link>
            </HoverBorderGradient>
            <HoverBorderGradient
              containerClassName="rounded-md"
              as="button"
              className="bg-sidebar text-white flex items-center space-x-2"
            >
              <Link href={"/templates"}>templates</Link>
            </HoverBorderGradient>
          </div>
        </div>
      </div>
    </div>
  );
}
