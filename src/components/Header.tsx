'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useIsAdmin } from "@/lib/admin"
import Link from "next/link"
import { Settings } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"

export default function Header() {
  const { isAdmin } = useIsAdmin()

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm dark:bg-gray-900/95 dark:border-gray-800 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-gray-900 dark:text-white">CodeImpact</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">.dev</div>
            </div>
          </Link>
        </div>


        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-medium dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
              >
                Sign In with GitHub
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              </Link>
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 ring-2 ring-blue-100 hover:ring-blue-200 transition-all dark:ring-blue-800 dark:hover:ring-blue-700",
                  userButtonPopoverCard: "shadow-xl border-0",
                  userButtonPopoverActionButton: "hover:bg-blue-50 dark:hover:bg-blue-900"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}