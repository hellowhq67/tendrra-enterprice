"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardSpotlight } from "../ui/card-spotlight"
import { FileText, MessageSquare, Download } from "lucide-react"
import { Button } from "../ui/button"

interface ArticleActionsProps {
  article: {
    id: string
    title: string
    type: string
  }
}

export function ArticleActions({ article }: ArticleActionsProps) {
  return (
    <section className="py-12 relative z-10">
      <div className="container mx-auto px-4">
        <CardSpotlight className="bg-gray-900/50 backdrop-blur-sm">
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Resources</span>
              </TabsTrigger>
              <TabsTrigger value="discussion" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Discussion</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resources">
              <div className="prose prose-invert max-w-none">
                <h3>Additional Resources</h3>
                <p>Enhance your learning with these additional resources related to {article.title}.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Cheat Sheet</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          A quick reference guide for the key concepts covered in this {article.type}.
                        </p>
                        <Button variant="outline" size="sm" className="text-xs h-8 border-gray-700">
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Practice Exercises</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Hands-on exercises to reinforce what you've learned.
                        </p>
                        <Button variant="outline" size="sm" className="text-xs h-8 border-gray-700">
                          Download Exercises
                        </Button>
                      </div>
                    </div>
                  </div>

                  {article.type === "course" && (
                    <div className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-900/50 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1">Course Slides</h4>
                          <p className="text-sm text-gray-400 mb-3">Presentation slides from the course lectures.</p>
                          <Button variant="outline" size="sm" className="text-xs h-8 border-gray-700">
                            Download Slides
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-900/50 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Further Reading</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          A curated list of articles and resources for deeper learning.
                        </p>
                        <Button variant="outline" size="sm" className="text-xs h-8 border-gray-700">
                          View List
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discussion">
              <div className="prose prose-invert max-w-none">
                <h3>Join the Discussion</h3>
                <p>Have questions or insights about this {article.type}? Join the conversation below.</p>

                <div className="mt-6 space-y-6">
                  <div className="border border-gray-800 rounded-lg p-4">
                    <textarea
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                      placeholder={`Share your thoughts about "${article.title}"...`}
                    ></textarea>
                    <div className="mt-3 flex justify-end">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white">
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  <div className="text-center text-gray-400">
                    <p>Be the first to start the discussion!</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardSpotlight>
      </div>
    </section>
  )
}

