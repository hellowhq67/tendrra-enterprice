<<<<<<< HEAD
"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, CreditCard, FileText, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useSession } from "next-auth/react"
import { SidebarFooter } from "./sidebar"


interface NavItem {
  title: string
  href: string
  icon?: React.ElementType
  items?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Getting Started",
    href: "#",
    icon: BookOpen,
    items: [
      { title: "Free Template", href: "/template" },
      { title: "Quick Start", href: "/quick-start" },
    ],
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: FileText,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Components", href: "/docs/components" },
      { title: "API Reference", href: "/docs/api" },
    ],
  },
  {
    title: "Learn",
    href: "/learn",
    icon: GraduationCap,
    items: [
      { title: "Tutorials", href: "/learn/tutorials" },
      { title: "Examples", href: "/learn/examples" },
      { title: "Best Practices", href: "/learn/best-practices" },
    ],
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
]

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<string | null>(null)
 const {data:session }=useSession()
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 h-screen ">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
        </SheetHeader>
        <nav className="space-y-2 p-4">
          {navItems.map((item) => (
            <div key={item.title} className="space-y-1">
              {item.items ? (
                <>
                  <button
                    onClick={() => setActiveSection(activeSection === item.title ? null : item.title)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.title}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transform transition-transform ${activeSection === item.title ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {activeSection === item.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-6 space-y-1 mt-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="block px-2 py-1.5 text-sm text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
     
        
 
      </SheetContent>

    </Sheet>
  )
}

=======
"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, CreditCard, FileText, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useSession } from "next-auth/react"
import { SidebarFooter } from "./sidebar"


interface NavItem {
  title: string
  href: string
  icon?: React.ElementType
  items?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Getting Started",
    href: "#",
    icon: BookOpen,
    items: [
      { title: "Free Template", href: "/template" },
      { title: "Quick Start", href: "/quick-start" },
    ],
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: FileText,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Components", href: "/docs/components" },
      { title: "API Reference", href: "/docs/api" },
    ],
  },
  {
    title: "Learn",
    href: "/learn",
    icon: GraduationCap,
    items: [
      { title: "Tutorials", href: "/learn/tutorials" },
      { title: "Examples", href: "/learn/examples" },
      { title: "Best Practices", href: "/learn/best-practices" },
    ],
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
]

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<string | null>(null)
 const {data:session }=useSession()
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 h-screen ">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
        </SheetHeader>
        <nav className="space-y-2 p-4">
          {navItems.map((item) => (
            <div key={item.title} className="space-y-1">
              {item.items ? (
                <>
                  <button
                    onClick={() => setActiveSection(activeSection === item.title ? null : item.title)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.title}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transform transition-transform ${activeSection === item.title ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {activeSection === item.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-6 space-y-1 mt-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="block px-2 py-1.5 text-sm text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
     
        
 
      </SheetContent>

    </Sheet>
  )
}

>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
