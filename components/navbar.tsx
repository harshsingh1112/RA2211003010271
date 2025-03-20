"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, TrendingUp, Activity } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Top Users", href: "/", icon: <BarChart className="h-5 w-5" /> },
    { name: "Trending Posts", href: "/trending", icon: <TrendingUp className="h-5 w-5" /> },
    { name: "Feed", href: "/feed", icon: <Activity className="h-5 w-5" /> },
  ]

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">Social Media Analytics</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 text-xs font-medium ${
                pathname === item.href ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

