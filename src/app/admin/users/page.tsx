'use client'

import { useState, useEffect } from 'react'
import AdminNav from '@/components/AdminNav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Search, Trash2, Users, Vote, DollarSign } from 'lucide-react'

interface UserStats {
  user_id: string
  vote_count: number
  total_contribution: number
  average_contribution: number
  latest_vote: string
  technologies_voted: string[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserStats[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalStats, setTotalStats] = useState({
    totalUsers: 0,
    totalVotes: 0,
    totalImpact: 0
  })

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.technologies_voted.some(tech =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const loadUsers = async () => {
    try {
      setLoading(true)

      // Get all votes with technology names
      const { data: votes, error } = await supabase
        .from('votes')
        .select(`
          user_id,
          impact_value,
          created_at,
          technologies (name)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Group by user and calculate stats
      const userMap = new Map<string, UserStats>()

      votes?.forEach(vote => {
        const userId = vote.user_id
        const techName = (vote.technologies as any)?.name || 'Unknown'

        if (userMap.has(userId)) {
          const existing = userMap.get(userId)!
          existing.vote_count += 1
          existing.total_contribution += vote.impact_value
          existing.technologies_voted.push(techName)
          if (vote.created_at > existing.latest_vote) {
            existing.latest_vote = vote.created_at
          }
        } else {
          userMap.set(userId, {
            user_id: userId,
            vote_count: 1,
            total_contribution: vote.impact_value,
            average_contribution: vote.impact_value,
            latest_vote: vote.created_at,
            technologies_voted: [techName]
          })
        }
      })

      // Calculate averages and remove duplicates
      const userStats = Array.from(userMap.values()).map(user => ({
        ...user,
        average_contribution: user.total_contribution / user.vote_count,
        technologies_voted: [...new Set(user.technologies_voted)]
      })).sort((a, b) => b.total_contribution - a.total_contribution)

      setUsers(userStats)
      setFilteredUsers(userStats)

      // Calculate total stats
      setTotalStats({
        totalUsers: userStats.length,
        totalVotes: userStats.reduce((sum, user) => sum + user.vote_count, 0),
        totalImpact: userStats.reduce((sum, user) => sum + user.total_contribution, 0)
      })

    } catch (error) {
      console.error('Failed to load users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(`Are you sure you want to delete all data for user ${userId.slice(0, 8)}...? This will remove all their votes and cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', userId)

        if (error) {
          throw error
        }

        toast.success('User data deleted successfully')
        loadUsers()
      } catch (error) {
        console.error('Failed to delete user:', error)
        toast.error('Failed to delete user data')
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNav />

      <div className="flex-1 overflow-hidden">
        <div className="md:hidden">
          <AdminNav />
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users or technologies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="p-3 rounded-md bg-blue-100">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-500">Total Users</div>
                        <div className="text-2xl font-semibold text-gray-900">
                          {loading ? '...' : totalStats.totalUsers}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="p-3 rounded-md bg-green-100">
                          <Vote className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-500">Total Votes</div>
                        <div className="text-2xl font-semibold text-gray-900">
                          {loading ? '...' : totalStats.totalVotes}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="p-3 rounded-md bg-purple-100">
                          <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-500">Total Impact</div>
                        <div className="text-2xl font-semibold text-gray-900">
                          {loading ? '...' : `$${(totalStats.totalImpact / 1000).toFixed(0)}K`}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Users Table */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>
                    All registered users and their voting statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Votes</TableHead>
                          <TableHead>Total Contribution</TableHead>
                          <TableHead>Average</TableHead>
                          <TableHead>Technologies</TableHead>
                          <TableHead>Last Activity</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.user_id}>
                            <TableCell className="font-mono text-sm">
                              {user.user_id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>{user.vote_count}</TableCell>
                            <TableCell>
                              ${(user.total_contribution / 1000).toFixed(1)}K
                            </TableCell>
                            <TableCell>
                              ${(user.average_contribution / 1000).toFixed(1)}K
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="text-sm text-gray-600 truncate">
                                  {user.technologies_voted.slice(0, 3).join(', ')}
                                  {user.technologies_voted.length > 3 &&
                                    ` +${user.technologies_voted.length - 3} more`
                                  }
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(user.latest_vote).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user.user_id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  {!loading && filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {searchTerm ? 'No users found' : 'No users yet'}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm
                          ? 'Try adjusting your search terms.'
                          : 'Users will appear here once they start voting.'
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}