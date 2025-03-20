"use client"

import { useState, useEffect, useRef } from "react"
import { getUsers, getUserPosts, getPostComments, type PostWithComments } from "@/lib/api"
import PostCard from "@/components/post-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function FeedPage() {
  const [posts, setPosts] = useState<PostWithComments[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true)

  // Function to fetch all posts
  const fetchPosts = async () => {
    try {
      setRefreshing(true)
      // Get all users
      const usersData = await getUsers()

      // Fetch all posts from all users
      const allPostsPromises = Object.keys(usersData).map((userId) => getUserPosts(userId))
      const postsArrays = await Promise.all(allPostsPromises)

      // Flatten the array of post arrays
      const allPosts = postsArrays.flat()

      // Fetch comment counts for each post
      const postsWithCommentsPromises = allPosts.map(async (post) => {
        const comments = await getPostComments(post.id)
        return {
          ...post,
          commentCount: comments.length,
        }
      })

      const postsWithComments = await Promise.all(postsWithCommentsPromises)

      // Sort by post ID (assuming higher IDs are newer posts)
      const sortedPosts = postsWithComments.sort((a, b) => b.id - a.id)

      // Only update state if component is still mounted
      if (isMounted.current) {
        setPosts(sortedPosts)
        setLoading(false)
        setRefreshing(false)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      if (isMounted.current) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPosts()

    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(() => {
      if (isMounted.current) {
        fetchPosts()
      }
    }, 30000)

    // Cleanup function
    return () => {
      isMounted.current = false
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Feed</CardTitle>
            <CardDescription>Latest posts from all users</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPosts}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-[200px] w-full rounded-md" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="text-center text-gray-500 py-8">No posts found</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

