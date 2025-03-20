// API functions to interact with the test server

// Base URL for the API
const API_BASE_URL = "http://20.244.56.144/test"

// Types
export interface User {
  id: string
  name: string
}

export interface Post {
  id: number
  userid: number
  content: string
  imageUrl?: string // We'll generate this client-side
}

export interface Comment {
  id: number
  postid: number
  content: string
}

export interface UserWithPostCount extends User {
  postCount: number
}

export interface PostWithComments extends Post {
  commentCount: number
  comments?: Comment[]
}

// Function to get all users
export async function getUsers(): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }
    const data = await response.json()
    return data.users
  } catch (error) {
    console.error("Error fetching users:", error)
    return {}
  }
}

// Function to get posts for a specific user
export async function getUserPosts(userId: string): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`)
    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${userId}`)
    }
    const data = await response.json()

    // Add random image URLs to posts
    return data.posts.map((post: Post) => ({
      ...post,
      imageUrl: getRandomImageUrl(post.content),
    }))
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error)
    return []
  }
}

// Function to get comments for a specific post
export async function getPostComments(postId: number): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`)
    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${postId}`)
    }
    const data = await response.json()
    return data.comments
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    return []
  }
}

// Helper function to generate random image URLs based on post content
function getRandomImageUrl(content: string): string {
  // Extract a keyword from the content (assuming format "Post about X")
  const keyword = content.toLowerCase().replace("post about ", "").trim()

  // Generate a random size between 300-500px
  const width = Math.floor(Math.random() * 200) + 300
  const height = Math.floor(Math.random() * 200) + 300

  // Use placeholder.com with the keyword
  return `https://via.placeholder.com/${width}x${height}/${getColorFromKeyword(keyword)}/FFFFFF?text=${keyword}`
}

// Generate a consistent color based on keyword
function getColorFromKeyword(keyword: string): string {
  // Simple hash function to generate a color
  let hash = 0
  for (let i = 0; i < keyword.length; i++) {
    hash = keyword.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert to hex color
  let color = Math.abs(hash).toString(16).substring(0, 6)
  // Pad with zeros if needed
  while (color.length < 6) {
    color = "0" + color
  }

  return color
}

