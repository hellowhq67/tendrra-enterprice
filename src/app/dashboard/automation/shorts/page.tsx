"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScriptGenerator } from "@/components/youtube/script-genaretor"
import { ThumbnailGenerator } from "@/components/youtube/thumbnail-gen"
import { ImageGenerator } from "@/components/youtube/image-genaretor"
import { AudioGenerator } from "@/components/youtube/audio-generator"
import { VideoGenerator } from "@/components/youtube/video-generator"
import { TranscriptGenerator } from "@/components/youtube/transcript-genaretor"
import {
  ProjectContext,
  ProjectProvider,
} from "@/components/youtube/project-contenxt"
import { Button } from "@/components/ui/button"
import {
  Download,
  Save,
  Share2,
  Plus,
  Folder,
  FileText,
  Image,
  Music,
  Video,
  Sparkles,
  Captions,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useProject } from "@/hooks/use-project"
import Dashboard from "@/components/Dashboard/app-dashboard"
import { AppSidebar } from "@/components/Dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { CaptionGenerator } from "@/components/youtube/caption-generator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
export default function YouTubeShortsPage() {
  return (
    <SidebarProvider>
      <AppSidebar className="border-r border-sidebar-border" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-sidebar-border">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-white" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-white" href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-white" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#9ca3af]">Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="bg-black min-h-screen">
          <ProjectProvider>
            <YouTubeShortsContent />
          </ProjectProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>

  )
}

function YouTubeShortsContent() {
  const { project, updateProject, calculateProgress } = React.useContext(ProjectContext)
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = React.useState(false)
  const [isOpenProjectDialogOpen, setIsOpenProjectDialogOpen] = React.useState(false)
  const [currentProjectId, setCurrentProjectId] = React.useState<string | null>(null)
  const { updateProject: saveProject, createProject, isLoading: isSaving } = useProject()
  const [isExporting, setIsExporting] = React.useState(false)
  const [isSharing, setIsSharing] = React.useState(false)
  const progress = calculateProgress()
  const { toast } = useToast()

  const handleSaveProject = async () => {
    try {
      if (currentProjectId) {
        // Update existing project
        await saveProject(currentProjectId, project)
      } else {
        // Create new project
        const newProject = await createProject(project)
        if (newProject) {
          setCurrentProjectId(newProject.id)
        }
      }

      toast({
        title: "Project saved",
        description: "Your YouTube Shorts project has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExport = async () => {
    if (!project.video) {
      toast({
        title: "Video required",
        description: "Please generate a video first",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would download the video file
      const link = document.createElement("a")
      link.href = project.video
      link.download = `youtube-short-${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export complete",
        description: "Your YouTube Short has been exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    if (!project.video) {
      toast({
        title: "Video required",
        description: "Please generate a video first",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would generate a shareable link
      navigator.clipboard.writeText(`https://example.com/share/${Date.now()}`)

      toast({
        title: "Share link created",
        description: "Shareable link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create share link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleCaptionGenerated = (
    captions: { text: string; startFrame: number; endFrame: number }[]
  ) => {
    updateProject({ ...project, captions })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          YouTube Shorts Generator
        </h2>
        <div className="flex items-center gap-2">
          <NewProjectDialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen} />
          <OpenProjectDialog open={isOpenProjectDialogOpen} onOpenChange={setIsOpenProjectDialogOpen} />
          <Button
            variant="outline"
            onClick={handleSaveProject}
            disabled={isSaving}
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Project"}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            disabled={isSharing || !project.video}
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {isSharing ? "Sharing..." : "Share"}
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || !project.video}
            className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      <ProjectSummary />

      <Tabs defaultValue="script" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7 bg-background/10 p-1">
          <TabsTrigger
            value="script"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-700 data-[state=active]:text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            1. Script
          </TabsTrigger>
          <TabsTrigger
            value="transcript"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-700 data-[state=active]:text-white"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            2. Transcript
          </TabsTrigger>
          <TabsTrigger
            value="captions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-700 data-[state=active]:text-white"
          >
            <Captions className="mr-2 h-4 w-4" />
            7. Captions
          </TabsTrigger>
          <TabsTrigger
            value="thumbnail"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-700 data-[state=active]:text-white"
          >
            <Image className="mr-2 h-4 w-4" />
            3. Thumbnail
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-700 data-[state=active]:text-white"
          >
            <Image className="mr-2 h-4 w-4" />
            4. Images
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-700 data-[state=active]:text-white"
          >
            <Music className="mr-2 h-4 w-4" />
            5. Audio
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white"
          >
            <Video className="mr-2 h-4 w-4" />
            6. Video
          </TabsTrigger>
        
        </TabsList>
        <TabsContent value="script" className="space-y-4">
          <ScriptGenerator />
        </TabsContent>
        <TabsContent value="transcript" className="space-y-4">
          <TranscriptGenerator />
        </TabsContent>
        <TabsContent value="captions" className="space-y-4">
          <CaptionGenerator transcript={project.transcript} onGenerate={handleCaptionGenerated} />
        </TabsContent>
        <TabsContent value="thumbnail" className="space-y-4">
          <ThumbnailGenerator />
        </TabsContent>
        <TabsContent value="images" className="space-y-4">
          <ImageGenerator />
        </TabsContent>
        <TabsContent value="audio" className="space-y-4">
          <AudioGenerator />
        </TabsContent>
        <TabsContent value="video" className="space-y-4">
          <VideoGenerator />
        </TabsContent>
       
      </Tabs>
    </div>
  )
}

function ProjectSummary() {
  const { project, calculateProgress } = React.useContext(ProjectContext)
  const progress = calculateProgress()

  return (
    <Card className="bg-background/5 border-none shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">{project.title || "Untitled Project"}</CardTitle>
            <CardDescription>{project.description || "No description"}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Overall Progress</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress
            value={progress}
            className="h-2 bg-background/20"
            indicatorClassName="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
          />

          <div className="grid grid-cols-7 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-cyan-400">Script</p>
                <p className="text-xs text-cyan-400/70">{project.progress.script}%</p>
              </div>
              <Progress
                value={project.progress.script}
                className="h-1 bg-background/20"
                indicatorClassName="bg-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-purple-400">Transcript</p>
                <p className="text-xs text-purple-400/70">{project.progress.transcript}%</p>
              </div>
              <Progress
                value={project.progress.transcript}
                className="h-1 bg-background/20"
                indicatorClassName="bg-purple-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-pink-400">Thumbnail</p>
                <p className="text-xs text-pink-400/70">{project.progress.thumbnail}%</p>
              </div>
              <Progress
                value={project.progress.thumbnail}
                className="h-1 bg-background/20"
                indicatorClassName="bg-pink-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-orange-400">Images</p>
                <p className="text-xs text-orange-400/70">{project.progress.images}%</p>
              </div>
              <Progress
                value={project.progress.images}
                className="h-1 bg-background/20"
                indicatorClassName="bg-orange-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-green-400">Audio</p>
                <p className="text-xs text-green-400/70">{project.progress.audio}%</p>
              </div>
              <Progress
                value={project.progress.audio}
                className="h-1 bg-background/20"
                indicatorClassName="bg-green-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-blue-400">Video</p>
                <p className="text-xs text-blue-400/70">{project.progress.video}%</p>
              </div>
              <Progress
                value={project.progress.video}
                className="h-1 bg-background/20"
                indicatorClassName="bg-blue-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-indigo-400">Captions</p>
                <p className="text-xs text-indigo-400/70">
                {project.progress.captions}%
                </p>
              </div>
              <Progress
                value={project.progress.captions}
                className="h-1 bg-background/20"
                indicatorClassName="bg-indigo-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NewProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const { createProject, isLoading: isCreating } = useProject()
  const { updateProject } = React.useContext(ProjectContext)
  const { toast } = useToast()

  const handleCreate = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your project",
        variant: "destructive",
      })
      return
    }

    const initialProjectData = {
      title,
      description,
      script: null,
      transcript: null,
      seoKeywords: [],
      seoScore: 0,
      contentAnalysis: null,
      thumbnail: null,
      images: [],
      audio: null,
      video: null,
      captions: [],
      progress: {
        script: 0,
        transcript: 0,
        thumbnail: 0,
        images: 0,
        audio: 0,
        video: 0,
        seo: 0,
        captions: 0,
      },
    };

    const newProject = await createProject(initialProjectData);

    if (newProject) {
      // Reset project and set new title/description
      updateProject({
        title: newProject.title,
        description: newProject.description,
        script: null,
        transcript: null,
        seoKeywords: [],
        seoScore: 0,
        contentAnalysis: null,
        thumbnail: null,
        images: [],
        audio: null,
        video: null,
         captions: [],
        progress: {
          script: 0,
          transcript: 0,
          thumbnail: 0,
          images: 0,
          audio: 0,
          video: 0,
          seo: 0,
           captions: 0,
        },
      })

      onOpenChange(false)
      setTitle("")
      setDescription("")

      toast({
        title: "Project created",
        description: "Your new project has been created",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background/95 backdrop-blur-sm border-cyan-500/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Create New Project</DialogTitle>
          <DialogDescription>Create a new YouTube Shorts project</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-cyan-400">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-cyan-500/30 focus:ring-cyan-500/30"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-cyan-400">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 border-cyan-500/30 focus:ring-cyan-500/30"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white"
          >
            {isCreating ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function OpenProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [projects, setProjects] = React.useState<any[]>([])
  const { getProjects, getProject, isLoading: isLoadingProjects } = useProject()
  const { updateProject } = React.useContext(ProjectContext)
  const { toast } = useToast()

  React.useEffect(() => {
    const fetchProjects = async () => {
      if (open) {
        const fetchedProjects = await getProjects()
        if (fetchedProjects) {
          setProjects(fetchedProjects)
        }
      }
    }

    fetchProjects()
  }, [open, getProjects])

  const handleOpenProject = async (project: any) => {
    const fullProject = await getProject(project.id)
    if (fullProject) {
      updateProject({
        title: fullProject.title,
        description: fullProject.description,
        script: fullProject.script,
        transcript: fullProject.transcript,
        seoKeywords: fullProject.seoKeywords,
        seoScore: fullProject.seoScore,
        contentAnalysis: fullProject.contentAnalysis,
        thumbnail: fullProject.thumbnail,
        images: fullProject.images,
        audio: fullProject.audio,
        video: fullProject.video,
        captions: fullProject.captions,
        progress: fullProject.progress,
      })

      onOpenChange(false)
      toast({
        title: "Project opened",
        description: "Your project has been loaded",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
          <Folder className="mr-2 h-4 w-4" />
          Open Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-background/95 backdrop-blur-sm border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-purple-400">Open Project</DialogTitle>
          <DialogDescription>Select a project to open</DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {isLoadingProjects ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No projects found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer hover:bg-background/10 bg-background/5 border-purple-500/20"
                  onClick={() => handleOpenProject(project)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-base text-purple-400">{project.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(project.updatedAt).toLocaleDateString()} •{project.script ? " Script ✓" : ""}
                      {project.transcript ? " Transcript ✓" : ""}
                      {project.thumbnail ? " Thumbnail ✓" : ""}
                      {project.images?.length > 0 ? ` Images (${project.images.length}) ✓` : ""}
                      {project.audio ? " Audio ✓" : ""}
                      {project.video ? " Video ✓" : ""}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}