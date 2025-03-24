"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, ClockIcon, LinkedinIcon, TwitterIcon, InstagramIcon, Loader2Icon, XIcon } from "lucide-react"
import { createScheduledPost } from "@/app/ai/action"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SchedulePostProps {
  onPostScheduled: (post: any) => void
  initialContent?: string
  initialPlatform?: string
  initialImageUrl?: string
}

export function SchedulePost({
  onPostScheduled,
  initialContent = "",
  initialPlatform = "linkedin",
  initialImageUrl,
}: SchedulePostProps) {
  const [content, setContent] = useState(initialContent)
  const [platform, setPlatform] = useState(initialPlatform)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("09:00")
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "")
  const [isScheduling, setIsScheduling] = useState(false)
  const [error, setError] = useState("")

  const handleSchedule = async () => {
    if (!content) {
      setError("Please enter content for your post")
      return
    }

    if (!date) {
      setError("Please select a date")
      return
    }

    setIsScheduling(true)
    setError("")

    try {
      // Combine date and time
      const scheduledDate = new Date(date)
      const [hours, minutes] = time.split(":").map(Number)
      scheduledDate.setHours(hours, minutes)

      const post = await createScheduledPost({
        content,
        platform,
        scheduledTime: scheduledDate.toISOString(),
        imageUrl: imageUrl || undefined,
      })

      onPostScheduled(post)
      setContent("")
      setDate(new Date())
      setTime("09:00")
      setImageUrl("")
    } catch (error) {
      setError("Failed to schedule post. Please try again.")
      console.error("Error scheduling post:", error)
    } finally {
      setIsScheduling(false)
    }
  }

  const renderPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case "linkedin":
        return <LinkedinIcon className="h-4 w-4 text-blue-600" />
      case "twitter":
        return <TwitterIcon className="h-4 w-4 text-sky-500" />
      case "instagram":
        return <InstagramIcon className="h-4 w-4 text-pink-600" />
      default:
        return null
    }
  }

  const timeOptions = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Post</CardTitle>
        <CardDescription>Create and schedule your social media post</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Platform</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={platform === "linkedin" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setPlatform("linkedin")}
              >
                <LinkedinIcon className="h-4 w-4 mr-2 text-blue-600" />
                LinkedIn
              </Button>
              <Button
                variant={platform === "twitter" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setPlatform("twitter")}
              >
                <TwitterIcon className="h-4 w-4 mr-2 text-sky-500" />
                Twitter
              </Button>
              <Button
                variant={platform === "instagram" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setPlatform("instagram")}
              >
                <InstagramIcon className="h-4 w-4 mr-2 text-pink-600" />
                Instagram
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content..."
              className="min-h-[120px]"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {content.length} characters
              {platform === "twitter" && content.length > 280 && (
                <span className="text-red-500 ml-1">(exceeds Twitter's 280 character limit)</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <input type="date" name="" id="" />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Time</label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Image (Optional)</label>
            <div className="flex items-center gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={() => setImageUrl("")} disabled={!imageUrl}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            {imageUrl && (
              <div className="mt-2 aspect-video relative rounded overflow-hidden bg-muted">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Post image"
                  className="object-cover w-full h-full"
                  onError={() => setImageUrl("/placeholder.svg?height=200&width=400")}
                />
              </div>
            )}
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSchedule} disabled={!content || !date || isScheduling} className="w-full">
          {isScheduling ? (
            <>
              <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <ClockIcon className="h-4 w-4 mr-2" />
              Schedule Post
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

