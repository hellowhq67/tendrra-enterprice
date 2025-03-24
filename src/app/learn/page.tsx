import { LearnHeader } from "@/components/learn/learn-header"
import { LearnFeatured } from "@/components/learn/learn-featured"
import { LearnCategories } from "@/components/learn/learn-categories"
import { LearnContent } from "@/components/learn/learn-content"
import { LearnCourses } from "@/components/learn/learn-courses"
import { LearnChatButton } from "@/components/learn/learn-chat-button"

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <LearnHeader />
      <LearnFeatured />
      <LearnCategories />
      <LearnContent />
      <LearnCourses />
      <LearnChatButton />
    </main>
  )
}

