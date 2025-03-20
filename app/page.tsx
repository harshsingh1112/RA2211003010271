"use client"

import { useState, useEffect } from "react"
import { getUsers, getUserPosts, type UserWithPostCount } from "@/lib/api"
import UserCard from "@/components/user-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TopUsersPage() {
  const [topUsers, setTopUsers] = useState<UserWithPostCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopUsers() {
      try {
        setLoading(true)
        // Get all users
        const usersData = await getUsers()

        // Create array of promises to fetch post counts for each user
        const userPromises = Object.entries(usersData).map(async ([id, name]) => {
          const posts = await getUserPosts(id)
          return {
            id,
            name,
            postCount: posts.length,
          }
        })

        // Wait for all promises to resolve
        const usersWithPostCounts = await Promise.all(userPromises)

        // Sort by post count (descending) and take top 5
        const sortedUsers = usersWithPostCounts.sort((a, b) => b.postCount - a.postCount).slice(0, 5)

        setTopUsers(sortedUsers)
      } catch (error) {
        console.error("Error fetching top users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopUsers()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Users</CardTitle>
          <CardDescription>The 5 most active users based on number of posts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topUsers.map((user, index) => (
                <UserCard key={user.id} user={user} rank={index + 1} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

