import { useUser } from '@clerk/nextjs'

export function useIsAdmin() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return { isAdmin: false, loading: true }
  }

  const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
  const isAdmin = user?.id === adminUserId

  console.log('Admin check:', {
    userId: user?.id,
    adminUserId,
    isAdmin,
    env: process.env.NEXT_PUBLIC_ADMIN_USER_ID
  })

  return { isAdmin, loading: false }
}

export function checkAdminAccess(userId: string | undefined): boolean {
  const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
  return userId === adminUserId
}