
import { RelatedTemplates } from "@/components/templeates/related-templates"
import { TemplateActions } from "@/components/templeates/template-actions"
import { TemplateDetail } from "@/components/templeates/template-detail"
import { TemplateDetailSkeleton } from "@/components/templeates/template-detail-skeleton"
import { TemplateReviews } from "@/components/templeates/template-reviews"
import { Suspense } from "react"

// This would typically come from a database or API
const getTemplateData = (id: string) => {
  // Mock data - in a real app, you would fetch this from an API
  const templates = {
    "social-media-dashboard": {
      id: "social-media-dashboard",
      title: "Social Media Dashboard Pro",
      description:
        "A comprehensive dashboard for managing all your social media accounts in one place. Track engagement, schedule posts, and analyze performance with our intuitive interface.",
      longDescription:
        "The Social Media Dashboard Pro template provides everything you need to manage your social media presence effectively. With real-time analytics, content scheduling, and engagement tracking, you'll be able to optimize your social media strategy and grow your audience.\n\nThis template includes customizable widgets for different platforms, automated reporting, and AI-powered content suggestions. It's perfect for social media managers, marketing teams, and businesses looking to streamline their social media operations.",
      image: "/placeholder.svg?height=600&width=1000&text=Social+Media+Dashboard",
      category: "social",
      isPremium: true,
      price: "$49",
      rating: 4.9,
      reviews: 128,
      features: [
        "Real-time analytics dashboard",
        "Content scheduling calendar",
        "Engagement tracking across platforms",
        "Automated reporting",
        "AI-powered content suggestions",
        "Competitor analysis",
        "Custom widget configuration",
        "Dark and light mode support",
      ],
      screenshots: [
        "/placeholder.svg?height=600&width=1000&text=Dashboard+Overview",
        "/placeholder.svg?height=600&width=1000&text=Analytics+View",
        "/placeholder.svg?height=600&width=1000&text=Content+Calendar",
        "/placeholder.svg?height=600&width=1000&text=Engagement+Metrics",
      ],
      relatedTemplates: ["instagram-story-pack", "content-calendar", "analytics-dashboard"],
    },
    "weekly-newsletter": {
      id: "weekly-newsletter",
      title: "Weekly Newsletter Template",
      description:
        "A clean, modern email template perfect for weekly newsletters. Easy to customize and optimize for high open rates.",
      longDescription:
        "Our Weekly Newsletter Template is designed to help you create professional, engaging newsletters that your subscribers will love to open and read. With a clean, modern design and optimized layout, this template is perfect for businesses, creators, and organizations looking to keep their audience informed and engaged.\n\nThe template is fully customizable and includes sections for featured content, news updates, product highlights, and calls to action. It's been tested across major email clients to ensure compatibility and responsiveness.",
      image: "/placeholder.svg?height=600&width=600&text=Email+Template",
      category: "email",
      isPremium: false,
      price: "Free",
      rating: 4.7,
      reviews: 94,
      features: [
        "Responsive design for all devices",
        "Customizable sections and layouts",
        "Tested across major email clients",
        "Optimized for high open rates",
        "Easy to edit with drag-and-drop editors",
        "Compatible with major email marketing platforms",
        "Includes documentation and setup guide",
      ],
      screenshots: [
        "/placeholder.svg?height=600&width=600&text=Newsletter+Preview",
        "/placeholder.svg?height=600&width=600&text=Mobile+View",
        "/placeholder.svg?height=600&width=600&text=Content+Blocks",
        "/placeholder.svg?height=600&width=600&text=Customization+Options",
      ],
      relatedTemplates: ["email-onboarding-sequence", "product-announcement", "monthly-digest"],
    },
    "instagram-story-pack": {
      id: "instagram-story-pack",
      title: "Instagram Story Templates Pack",
      description: "A collection of 20 Instagram story templates for product promotions and announcements.",
      longDescription:
        "Elevate your Instagram presence with our premium Story Templates Pack. This collection includes 20 professionally designed templates optimized for Instagram Stories, perfect for product promotions, announcements, sales, and more.\n\nEach template is fully customizable in Canva or Photoshop, allowing you to match your brand colors, fonts, and imagery. With a mix of layouts for different purposes, this pack will help you create cohesive, eye-catching stories that engage your audience and drive action.",
      image: "/placeholder.svg?height=600&width=600&text=Instagram+Stories",
      category: "social",
      isPremium: true,
      price: "$29",
      rating: 4.9,
      reviews: 203,
      features: [
        "20 unique story templates",
        "Fully customizable in Canva and Photoshop",
        "Optimized for Instagram dimensions",
        "Mix of layouts for different purposes",
        "Modern, trendy design elements",
        "Compatible with Instagram's interactive features",
        "Includes tutorial for customization",
      ],
      screenshots: [
        "/placeholder.svg?height=600&width=600&text=Story+Templates+Overview",
        "/placeholder.svg?height=600&width=600&text=Product+Promotion+Example",
        "/placeholder.svg?height=600&width=600&text=Announcement+Template",
        "/placeholder.svg?height=600&width=600&text=Sale+Template",
      ],
      relatedTemplates: ["social-media-dashboard", "content-calendar", "social-media-graphics-pack"],
    },
  }

  return templates[id as keyof typeof templates] || null
}

export default async function TemplateDetailPage({
    params,
  }: {
    params:Promise<{ id: string }>
  }) {
    const { id} = await params
  const templateData = getTemplateData(id)

  if (!templateData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Template Not Found</h1>
          <p className="text-gray-400 mb-8">The template you're looking for doesn't exist or has been removed.</p>
          <a
            href="/templates"
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Browse Templates
          </a>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Suspense fallback={<TemplateDetailSkeleton />}>
        <TemplateDetail template={templateData} />
      </Suspense>
      <TemplateActions template={templateData} />
      <TemplateReviews templateId={id} />
      <RelatedTemplates ids={templateData.relatedTemplates} currentId={id} />
    </main>
  )
}

