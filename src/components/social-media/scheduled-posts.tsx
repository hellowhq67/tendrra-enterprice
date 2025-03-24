"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  CalendarIcon,
  ClockIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface ScheduledPostsProps {
  posts?: any[]
  onSchedule: () => void
}

export function ScheduledPosts({ posts = [], onSchedule }: ScheduledPostsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (postToDelete) {
      // In a real app, you would call an API to delete the post
      // For now, we'll just close the dialog
      setPostToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Posts</CardTitle>
        <CardDescription>View and manage your scheduled social media posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {renderPlatformIcon(post.platform)}
                      <Badge variant={post.status === "posted" ? "secondary" : "default"}>
                        {post.status === "posted" ? "Posted" : "Scheduled"}
                      </Badge>
                    </div>

                    {post.status !== "posted" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2" onClick={() => onSchedule()}>
                            <EditIcon className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-destructive"
                            onClick={() => handleDeleteClick(post.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <p className="text-sm mb-3">{post.content}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{formatDate(post.scheduledTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>{formatTime(post.scheduledTime)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No posts scheduled yet</p>
              <Button onClick={onSchedule}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Schedule New Post
              </Button>
            </div>
          )}

          {posts.length > 0 && (
            <Button variant="outline" className="w-full" onClick={onSchedule}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Schedule New Post
            </Button>
          )}
        </div>
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scheduled Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scheduled post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

