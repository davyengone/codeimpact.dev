'use client'

import { use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useUserProfile } from "@/hooks/useUserProfile"
import { formatCurrency } from "@/lib/formatRevenue"
import { ArrowLeft, Share2, Trophy, DollarSign, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface UserProfilePageProps {
  params: Promise<{ userId: string }>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
}

const technologyColors = [
  "from-blue-500 to-cyan-400",
  "from-green-500 to-emerald-400",
  "from-blue-600 to-indigo-500",
  "from-yellow-500 to-orange-400",
  "from-cyan-500 to-blue-500",
  "from-purple-500 to-pink-500",
  "from-red-500 to-pink-400",
  "from-indigo-500 to-purple-500",
  "from-orange-500 to-red-400",
  "from-teal-500 to-cyan-400"
]

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = use(params)
  const { userId } = resolvedParams
  const { profile, loading, error } = useUserProfile(userId)

  const handleShare = async () => {
    const shareData = {
      title: `My Open Source Impact on CodeImpact.dev`,
      text: `I've generated ${formatCurrency(profile?.totalRevenue || 0)} in value from open source technologies! Check out my profile:`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      alert('Profile link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-2/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Profile Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              This user profile doesn&apos;t exist or hasn&apos;t made any votes yet.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rankings
          </Link>

          {/* Profile Header */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Open Source Impact Profile
                    </CardTitle>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary" className="px-3 py-1">
                        {profile.voteCount} Technologies
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        Profile ID: {userId.slice(0, 8)}...
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      Total economic value generated from open source technologies
                    </p>
                  </div>
                  <Button
                    onClick={handleShare}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Impact Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
          >
            <motion.div variants={cardVariants}>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-green-900 dark:text-green-100 mb-1">
                    {formatCurrency(profile.totalRevenue)}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Total Revenue Generated
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                    {profile.voteCount}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Technologies Used
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6 text-center">
                  <ExternalLink className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                    {formatCurrency(Math.round(profile.totalRevenue / profile.voteCount) || 0)}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                    Average per Technology
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Top Technologies */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Revenue Breakdown by Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                >
                  {profile.votes.map((vote, index) => {
                    const color = technologyColors[index % technologyColors.length]
                    const percentage = (vote.impact_value / profile.totalRevenue) * 100

                    return (
                      <motion.div key={vote.id} variants={cardVariants}>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${color} text-white font-bold text-sm shadow-md`}>
                              #{index + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {vote.technology.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {vote.technology.category} • {percentage.toFixed(1)}% of total
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {formatCurrency(vote.impact_value)}
                            </div>
                            {vote.reasoning && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
                                &quot;{vote.reasoning}&quot;
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={cardVariants}>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Want to track your own open source impact?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Join CodeImpact.dev and share the economic value open source technologies have brought to your career.
                </p>
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                  >
                    Start Tracking Your Impact
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}