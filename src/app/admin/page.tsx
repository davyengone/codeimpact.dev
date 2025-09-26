'use client'

import { useTechnologies } from '@/hooks/useTechnologies'
import { useVotes } from '@/hooks/useVotes'
import AdminNav from '@/components/AdminNav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Database, Users, Vote } from 'lucide-react'
import { formatCurrency } from '@/lib/formatRevenue'

export default function AdminDashboard() {
  const { technologies, loading: techLoading } = useTechnologies()
  const { loading: votesLoading } = useVotes()

  const stats = [
    {
      name: 'Total Technologies',
      value: technologies.length,
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Votes',
      value: technologies.reduce((sum, tech) => sum + tech.vote_count, 0),
      icon: Vote,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Total Impact Value',
      value: formatCurrency(technologies.reduce((sum, tech) => sum + tech.total_impact, 0)),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Categories',
      value: new Set(technologies.map(tech => tech.category)).size,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const topTechnologies = technologies.slice(0, 5)

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
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              {/* Stats */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.name}>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`p-3 rounded-md ${stat.bgColor}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </div>
                          <div className="text-2xl font-semibold text-gray-900">
                            {techLoading || votesLoading ? '...' : stat.value}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Top Technologies */}
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Technologies by Impact</CardTitle>
                    <CardDescription>
                      Most impactful technologies based on community votes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {techLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
                            </div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {topTechnologies.map((tech, index) => (
                          <div key={tech.id} className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                #{index + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {tech.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {tech.vote_count} votes • {tech.category}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(tech.total_impact)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}