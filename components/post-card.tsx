import Image from "next/image"
import { MessageCircle } from "lucide-react"
import type { PostWithComments } from "@/lib/api"

interface PostCardProps {
  post: PostWithComments
  showComments?: boolean
  isTrending?: boolean
}

export default function PostCard({ post, showComments = false, isTrending = false }: PostCardProps) {
  // Generate a consistent avatar based on user ID
  const avatarUrl = `https://i.pravatar.cc/150?u=${post.userid}`

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isTrending ? "border-2 border-yellow-400" : ""}`}>
      {isTrending && <div className="bg-yellow-400 text-yellow-800 text-xs font-medium px-4 py-1">🔥 Trending</div>}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image src={avatarUrl || "/placeholder.svg"} alt={`User ${post.userid}`} fill className="object-cover" />
          </div>
          <div>
            <p className="font-medium text-gray-800">User {post.userid}</p>
            <p className="text-xs text-gray-500">Post #{post.id}</p>
          </div>
        </div>

        <p className="text-gray-700 mb-3">{post.content}</p>

        {post.imageUrl && (
          <div className="relative h-48 w-full mb-3 rounded-md overflow-hidden">
            <Image src={post.imageUrl || "/placeholder.svg"} alt={post.content} fill className="object-cover" />
          </div>
        )}

        <div className="flex items-center text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentCount} comments</span>
          </div>
        </div>
      </div>

      {showComments && post.comments && post.comments.length > 0 && (
        <div className="bg-gray-50 p-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
          <div className="space-y-2">
            {post.comments.map((comment) => (
              <div key={comment.id} className="bg-white p-2 rounded border text-sm">
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-500">Comment #{comment.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

