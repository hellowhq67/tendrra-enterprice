"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Copy, Save, RefreshCw, Search, Sparkles, BarChart3, Tag } from "lucide-react"
import { ProjectContext } from "./project-contenxt"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function ScriptGenerator() {
  const { project, updateProject } = React.useContext(ProjectContext)
  const [title, setTitle] = React.useState(project.title)
  const [description, setDescription] = React.useState(project.description)
  const [topic, setTopic] = React.useState("")
  const [tone, setTone] = React.useState("informative")
  const [length, setLength] = React.useState("30")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedScript, setGeneratedScript] = React.useState(project.script || "")
  const [seoKeywords, setSeoKeywords] = React.useState<string[]>(project.seoKeywords || [])
  const [newKeyword, setNewKeyword] = React.useState("")
  const [seoScore, setSeoScore] = React.useState(project.seoScore || 0)
    const [contentAnalysis, setContentAnalysis] = React.useState(
    project.contentAnalysis || {
      engagement: 0,
      clarity: 0,
      originality: 0,
      suitability: 0,
    },
  )
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your YouTube Short",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/shorts/script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, topic, description, tone, length }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error); // Propagate API error to the catch block
      }

      setGeneratedScript(data.text);
      setSeoKeywords(data.keywords);
      setSeoScore(data.seoScore);
        setContentAnalysis(data.contentAnalysis)

      toast({
        title: "Script generated",
        description: "Your script has been generated successfully",
      });
    } catch (error: any) {
      console.error("Generation error:", error); // Log the detailed error
      toast({
        title: "Error",
        description: error.message || "Failed to generate script. Please try again.", // Show error from API if available
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    updateProject({
      title,
      description,
      script: generatedScript,
      seoKeywords,
      seoScore,
      contentAnalysis,
    })
    toast({
      title: "Script saved",
      description: "Your script has been saved to the project",
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript)
    toast({
      title: "Copied to clipboard",
      description: "Script copied to clipboard",
    })
  }

  const addKeyword = () => {
    if (newKeyword && !seoKeywords.includes(newKeyword)) {
      setSeoKeywords([...seoKeywords, newKeyword])
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setSeoKeywords(seoKeywords.filter((k) => k !== keyword))
  }

  const getSeoScoreColor = () => {
    if (seoScore >= 80) return "text-green-500"
    if (seoScore >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500"
    if (value >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-background/50 border-cyan-500/20">
        <CardHeader className="border-b border-cyan-500/20">
          <CardTitle className="text-cyan-400">Script Generator</CardTitle>
          <CardDescription>Generate a script for your YouTube Short</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-cyan-400">
              Video Title
            </Label>
            <Input
              id="title"
              placeholder="Enter a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-cyan-500/30 focus:ring-cyan-500/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-cyan-400">
              Video Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 border-cyan-500/30 focus:ring-cyan-500/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-cyan-400">
              Topic
            </Label>
            <Input
              id="topic"
              placeholder="What is your video about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-background/50 border-cyan-500/30 focus:ring-cyan-500/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-cyan-400">
                Tone
              </Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="bg-background/50 border-cyan-500/30 focus:ring-cyan-500/30">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="entertaining">Entertaining</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="length" className="text-cyan-400">
                Length (seconds)
              </Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger id="length" className="bg-background/50 border-cyan-500/30 focus:ring-cyan-500/30">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="45">45 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-cyan-500/20 pt-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Script"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-background/50 border-cyan-500/20">
        <CardHeader className="border-b border-cyan-500/20">
          <CardTitle className="text-cyan-400">Script & SEO</CardTitle>
          <CardDescription>Edit your script and optimize for search</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="script" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-cyan-500/20">
              <TabsTrigger
                value="script"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-cyan-500"
              >
                Script
              </TabsTrigger>
              <TabsTrigger
                value="seo"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-cyan-500"
              >
                SEO & Analysis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="script" className="p-6">
              {isGenerating ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : (
                <Textarea
                  className="min-h-[300px] bg-background/50 border-cyan-500/30 focus:ring-cyan-500/30"
                  placeholder="Your generated script will appear here..."
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                />
              )}
            </TabsContent>
            <TabsContent value="seo" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Search className="h-5 w-5 text-cyan-400" />
                    SEO Score
                  </h3>
                  <span className={`text-2xl font-bold ${getSeoScoreColor()}`}>{seoScore}/100</span>
                </div>
                <Progress value={seoScore} className="h-2" indicatorClassName={getProgressColor(seoScore)} />

                <div className="pt-2">
                  <Label htmlFor="keywords" className="text-cyan-400 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Keywords
                  </Label>
                  <div className="flex mt-2 mb-2">
                    <Input
                      id="keywords"
                      placeholder="Add keyword"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="bg-background/50 border-cyan-500/30 focus:ring-cyan-500/30"
                    />
                    <Button onClick={addKeyword} className="ml-2 bg-cyan-600 hover:bg-cyan-700" disabled={!newKeyword}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {seoKeywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                      >
                        {keyword}
                        <button
                          className="ml-1 text-cyan-400 hover:text-cyan-300"
                          onClick={() => removeKeyword(keyword)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {seoKeywords.length === 0 && (
                      <span className="text-sm text-muted-foreground">No keywords added yet</span>
                    )}
                  </div>
                </div>
              </div>

                 <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  Content Analysis
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Engagement</span>
                      <span className="text-sm">{contentAnalysis.engagement}%</span>
                    </div>
                    <Progress
                      value={contentAnalysis.engagement}
                      className="h-2"
                      indicatorClassName={getProgressColor(contentAnalysis.engagement)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Clarity</span>
                      <span className="text-sm">{contentAnalysis.clarity}%</span>
                    </div>
                    <Progress
                      value={contentAnalysis.clarity}
                      className="h-2"
                      indicatorClassName={getProgressColor(contentAnalysis.clarity)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Originality</span>
                      <span className="text-sm">{contentAnalysis.originality}%</span>
                    </div>
                    <Progress
                      value={contentAnalysis.originality}
                      className="h-2"
                      indicatorClassName={getProgressColor(contentAnalysis.originality)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Suitability</span>
                      <span className="text-sm">{contentAnalysis.suitability}%</span>
                    </div>
                    <Progress
                      value={contentAnalysis.suitability}
                      className="h-2"
                      indicatorClassName={getProgressColor(contentAnalysis.suitability)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  Optimization Tips
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Include your main keyword in the title and description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Keep your title under 60 characters for better visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">!</span>
                    <span>Add more specific keywords related to your niche</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">!</span>
                    <span>Consider adding trending hashtags to improve discoverability</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-cyan-500/20 pt-4">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!generatedScript}
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button onClick={handleSave} disabled={!generatedScript} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Save className="mr-2 h-4 w-4" />
            Save Script
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}