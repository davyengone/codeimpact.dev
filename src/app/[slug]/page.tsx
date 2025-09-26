'use client'

import { use, useMemo } from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import VoteDialog from "@/components/VoteDialog"
import { useTechnologyBySlug } from "@/hooks/useTechnologies"
import { useOptimisticUpdates } from "@/hooks/useOptimisticUpdates"
import { formatCurrency } from "@/lib/formatRevenue"
import { ArrowLeft, TrendingUp, Users, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

interface TechnologyPageProps {
  params: Promise<{ slug: string }>
}

export default function TechnologyPage({ params }: TechnologyPageProps) {
  const resolvedParams = use(params)
  const { slug } = resolvedParams
  const { technology, loading, error } = useTechnologyBySlug(slug)

  const technologyArray = useMemo(() =>
    technology ? [technology] : [],
    [technology]
  )

  const { optimisticTechnologies, addOptimisticVote } = useOptimisticUpdates(technologyArray)

  const optimisticTech = optimisticTechnologies[0] || technology

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-2/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !technology) {
    if (!loading && !technology) {
      notFound()
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Technology Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The technology you&apos;re looking for doesn&apos;t exist or hasn&apos;t been added yet.
            </p>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Rankings
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleVoteSuccess = (technologyId: number, impactValue: number, isUpdate: boolean = false) => {
    addOptimisticVote(technologyId, impactValue, isUpdate)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rankings
          </Link>

          {/* Technology Header */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {optimisticTech?.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      {optimisticTech?.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      Added {new Date(optimisticTech?.created_at || '').toLocaleDateString()}
                    </div>
                  </div>
                  {optimisticTech?.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      {optimisticTech.description}
                    </p>
                  )}
                </div>
                <SignedIn>
                  <VoteDialog
                    technologyId={optimisticTech?.id || 0}
                    technologyName={optimisticTech?.name || ''}
                    onVoteSuccess={handleVoteSuccess}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                    >
                      Vote Now
                    </Button>
                  </VoteDialog>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                    >
                      Vote Now
                    </Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </CardHeader>
          </Card>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                  {formatCurrency(optimisticTech?.total_impact || 0)}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Total Economic Impact
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                  {formatCurrency(Math.round(optimisticTech?.average_impact || 0))}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Average Impact per Vote
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                  {optimisticTech?.vote_count || 0}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                  Community Contributions
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action for Non-signed in Users */}
          <SignedOut>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Have experience with {optimisticTech?.name}?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Share the economic value this technology has brought to your career or business and help the community understand its real impact.
                </p>
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                  >
                    Add Your Impact Story
                  </Button>
                </SignInButton>
              </CardContent>
            </Card>
          </SignedOut>
        </div>
      </div>

      <Footer />
    </div>
  )
}