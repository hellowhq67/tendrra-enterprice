import { DocSidebar } from "@/components/ui/doc-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function DocumentationPage() {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <DocSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1" />

          </header>
          <main className="mx-auto max-w-4xl px-6 py-8">
            <article className="prose dark:prose-invert lg:prose-lg">
              <h1 id="introduction">Getting Started with Our Framework</h1>

              <p className="lead">
                Welcome to our comprehensive documentation. This guide will help you understand the core concepts and get
                started with building amazing applications.
              </p>

              <h2 id="quick-start">Quick Start Guide</h2>

              <p>
                Our framework provides a robust foundation for building modern web applications. With built-in features
                like server-side rendering, static site generation, and API routes, you can create full-stack applications
                with ease.
              </p>

              <div className="not-prose my-8 rounded-lg border bg-card p-4">
                <pre className="text-sm">
                  <code>{`npm create next-app@latest my-app --typescript
cd my-app
npm run dev`}</code>
                </pre>
              </div>

              <h2 id="installation">Installation</h2>

              <p>
                Getting started is easy. You can create a new project using our CLI tool which will set up everything you
                need to start developing right away.
              </p>

              <h3>System Requirements</h3>

              <ul>
                <li>Node.js 16.8 or later</li>
                <li>MacOS, Windows, or Linux</li>
                <li>npm or yarn package manager</li>
              </ul>

              <h2 id="components">Understanding Components</h2>

              <p>
                Components are the building blocks of any application built with our framework. They allow you to split
                the UI into independent, reusable pieces, and think about each piece in isolation.
              </p>

              <div className="not-prose my-8 rounded-lg border bg-card p-4">
                <pre className="text-sm">
                  <code>{`function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}`}</code>
                </pre>
              </div>

              <h2 id="state">State Management</h2>

              <p>
                State management is a crucial part of any application. Our framework provides several ways to manage
                state, from local component state to global application state.
              </p>

              <h2 id="data-flow">Data Flow</h2>

              <p>
                Understanding how data flows through your application is key to building maintainable applications. Our
                framework follows a unidirectional data flow pattern, making it easier to track changes and debug issues.
              </p>

              <div className="my-8 rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold">Data Flow Example</h3>
                <div className="aspect-video rounded-lg bg-muted" />
              </div>

              <h2 id="basic">Basic Usage</h2>

              <p>
                Let&apos;s look at some basic examples of how to use our framework. These examples will help you
                understand the fundamental concepts and patterns.
              </p>

              <h2 id="advanced">Advanced Patterns</h2>

              <p>
                Once you&apos;re comfortable with the basics, you can explore more advanced patterns and techniques to
                build complex applications.
              </p>

              <h2 id="practices">Best Practices</h2>

              <p>
                Following established best practices will help you write maintainable and scalable code. Here are some
                recommendations based on our experience.
              </p>
            </article>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

