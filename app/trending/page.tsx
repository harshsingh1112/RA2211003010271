"use client"

import { useState, useEffect } from "react"
import { getUsers, getUserPosts, getPostComments, type PostWithComments } from "@/lib/api"
import PostCard from "@/components/post-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TrendingPostsPage() {
  const [trendingPosts, setTrendingPosts] = useState<PostWithComments[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrendingPosts() {
      try {
        setLoading(true)
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
            comments,
          }
        })

        const postsWithComments = await Promise.all(postsWithCommentsPromises)

        // Find the maximum comment count
        const maxCommentCount = Math.max(...postsWithComments.map((post) => post.commentCount))

        // Filter posts with the maximum comment count
        const trending = postsWithComments.filter((post) => post.commentCount === maxCommentCount)

        setTrendingPosts(trending)
      } catch (error) {
        console.error("Error fetching trending posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingPosts()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trending Posts</CardTitle>
          <CardDescription>Posts with the highest number of comments</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-[200px] w-full rounded-md" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {trendingPosts.length > 0 ? (
                trendingPosts.map((post) => (
                  <PostCard key={post.id} post={post} showComments={true} isTrending={true} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No trending posts found</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

