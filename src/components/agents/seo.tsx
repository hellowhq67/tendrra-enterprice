"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { BackgroundBeams } from "../ui/background-beams";

interface AnalysisResult {
  backlinkSuggestions?: { url: string; description: string }[];
  onPageKeywords?: { keyword: string; searchVolume: number }[];
  totalImpressions?: number;
  metaKeywords?: string[];
  titleSuggestions?: string[];
}

export function SEO() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: `${user.username}`,
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo: React.FC = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

export const LogoIcon: React.FC = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

const Dashboard: React.FC = () => {
  const placeholders = [
    "Hi i am your SEO Agent",
    "Are you Ready To start?",
    "Just Pest You website URL",
  ];
  const { isLoaded, isSignedIn, user } = useUser();
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsiteUrl(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAnalyze();

  };


  const handleAnalyze = async () => {
    

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/v1/agents/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to fetch from API");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="flex flex-2">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 border-neutral-700 bg-neutral-900 flex flex-col gap-2 flex-1 w-screen h-full overflow-scroll">
        <div className="flex flex-2">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />


        </div>
        <div className="flex gap-2 flex-1 ">

          <div className="h-[20rem] w-[30rem] rounded-lg  bg-neutral-800 animate-pulse overflow-scroll">
            <h2 className="text-md my-2 text-white text-start mx-2">BackLinks Suggestion</h2>



            {analysisResult && (

              <div >
                {/* Backlink Suggestions */}
                {analysisResult.backlinkSuggestions && (
                  <ul className="list-disc pl-5 text-gray-700">
                    {analysisResult.backlinkSuggestions.map(
                      (backlink: any, index: number) => (
                        <li key={index} className="mb-2">
                          <a
                            href={backlink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:underline text-[14px]"
                          >
                            {backlink.url}
                          </a>

                          <p
                            className="text-gray-400 hover:underline text-[10px]"



                          >{backlink.description}</p>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>

            )}
          </div>

          <div className="h-[20rem]  w-[30rem] rounded-lg  bg-neutral-800 animate-pulse">

            <h3 className="text-md my-2 text-white text-start mx-2">On-Page SEO Keywords</h3>
            {analysisResult && (
              <div className="mt-6">

                {analysisResult.onPageKeywords && (


                  <ul className="list-disc pl-5 text-gray-700">
                    {analysisResult.onPageKeywords.map((keyword, index) => (
                      <li key={index} className="mb-2">
                        <span className="font-semibold">{keyword.keyword}</span>: Search volume {keyword.searchVolume}
                      </li>
                    ))}
                  </ul>

                )}

              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-1">

          <div className="h-[20rem] w-[30rem] rounded-lg  bg-neutral-800 animate-pulse">
            <h2 className="text-md my-2 text-white text-start mx-2">Meta Keyword Suggestions</h2>
            {analysisResult && (

              <div >
                {analysisResult.metaKeywords && (
                  <ul className="list-disc pl-5 text-gray-700">
                    {analysisResult.metaKeywords.map((keyword, index) => (
                      <li key={index}>{keyword}</li>
                    ))}
                  </ul>
                )}
              </div>

            )}
          </div>

          <div className="h-[20rem] w-[30rem] rounded-lg  bg-neutral-800 animate-pulse">

            <h3 className="text-md my-2 text-white text-start mx-2">SEO-Friendly Title Suggestions</h3>
            {analysisResult && (
              <div className="mt-6">

                {analysisResult.titleSuggestions && (
                  <ul className="list-disc pl-5 text-gray-700">
                    {analysisResult.titleSuggestions.map((title, index) => (
                      <li key={index}>{title}</li>
                    ))}
                  </ul>
                )}

              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};
