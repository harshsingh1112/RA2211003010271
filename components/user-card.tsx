import Image from "next/image"
import type { UserWithPostCount } from "@/lib/api"

interface UserCardProps {
  user: UserWithPostCount
  rank: number
}

export default function UserCard({ user, rank }: UserCardProps) {
  // Generate a consistent avatar based on user ID
  const avatarUrl = `https://i.pravatar.cc/150?u=${user.id}`

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="p-4 flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
          <Image src={avatarUrl || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
          <div className="absolute -top-1 -left-1 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            {rank}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {user.postCount} posts
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

