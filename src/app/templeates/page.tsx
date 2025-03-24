import { TemplateCategories } from "@/components/templeates/template-categories";
import { TemplateGrid } from "@/components/templeates/template-grid";
import { TemplatesFeatured } from "@/components/templeates/templates-featured";
import { TemplatesHeader } from "@/components/templeates/templates-header";
import { TemplatesNewsletter } from "@/components/templeates/templates-newsletter";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <TemplatesHeader />
      <TemplatesFeatured />
      <TemplateCategories />
      <TemplateGrid/>
      <TemplatesNewsletter/>
    </main>
  )
}

