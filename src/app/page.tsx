'use client'

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import VoteDialog from "@/components/VoteDialog"
import SuggestTechnologyDialog from "@/components/SuggestTechnologyDialog"
import { useTechnologies } from "@/hooks/useTechnologies"
import { useOptimisticUpdates } from "@/hooks/useOptimisticUpdates"
import { useEffect, useState } from "react"
import { Search, ChevronDown, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/formatRevenue"

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

const impactCategories = [
  {
    title: "Web Development",
    description: "Frontend and backend technologies that power the modern web.",
    color: "from-blue-500 to-cyan-400",
    technologies: ["React", "Vue.js", "Angular"]
  },
  {
    title: "DevOps & Infrastructure",
    description: "Tools that streamline deployment and infrastructure management.",
    color: "from-purple-500 to-pink-500",
    technologies: ["Docker", "Kubernetes", "Terraform"]
  },
  {
    title: "Programming Languages",
    description: "Languages that drive innovation across industries.",
    color: "from-green-500 to-emerald-400",
    technologies: ["Python", "TypeScript", "Rust"]
  },
  {
    title: "Data & Analytics",
    description: "Technologies powering data-driven decision making.",
    color: "from-orange-500 to-red-400",
    technologies: ["PostgreSQL", "MongoDB", "Apache Spark"]
  },
  {
    title: "Machine Learning",
    description: "AI and ML frameworks transforming industries.",
    color: "from-indigo-500 to-purple-600",
    technologies: ["TensorFlow", "PyTorch", "Scikit-learn"]
  },
  {
    title: "Mobile Development",
    description: "Cross-platform solutions for mobile applications.",
    color: "from-pink-500 to-rose-400",
    technologies: ["React Native", "Flutter", "Ionic"]
  }
]

export default function Home() {
  const { technologies, loading, error, refetch, refetchSilent } = useTechnologies()
  const { optimisticTechnologies, addOptimisticVote, syncWithRealData } = useOptimisticUpdates(technologies)
  const { isSignedIn } = useUser()

  // State for scroll and search functionality
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTechnologies, setFilteredTechnologies] = useState(optimisticTechnologies)

  // Note: Optimistic state syncs automatically via useOptimisticUpdates hook

  // Clear search when user signs out
  useEffect(() => {
    if (!isSignedIn && searchTerm) {
      setSearchTerm('')
    }
  }, [isSignedIn, searchTerm])

  // Filter technologies based on search term (only for signed-in users)
  useEffect(() => {
    if (isSignedIn && searchTerm.trim()) {
      const filtered = optimisticTechnologies.filter(tech =>
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTechnologies(filtered)
    } else {
      setFilteredTechnologies(optimisticTechnologies)
    }
  }, [searchTerm, optimisticTechnologies, isSignedIn])

  // Handle scroll detection - only for signed out users
  useEffect(() => {
    if (!isSignedIn) {
      const handleScroll = () => {
        // For signed out users, show sticky header after scrolling past categories
        const heroSection = document.getElementById('hero-section')
        const categoriesSection = document.getElementById('categories-section')

        if (heroSection && categoriesSection) {
          const categoriesBottom = categoriesSection.offsetTop + categoriesSection.offsetHeight
          const scrolled = window.scrollY > categoriesBottom - 100
          setIsScrolled(scrolled)
        }
      }

      // Throttle scroll events for better performance
      let ticking = false
      const throttledScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll()
            ticking = false
          })
          ticking = true
        }
      }

      window.addEventListener('scroll', throttledScroll, { passive: true })
      return () => window.removeEventListener('scroll', throttledScroll)
    }
  }, [isSignedIn])

  const handleVoteSuccess = (technologyId: number, impactValue: number, isUpdate: boolean = false) => {
    // Update UI optimistically first
    addOptimisticVote(technologyId, impactValue, isUpdate)

    // Then fetch real data silently in background
    refetchSilent()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white smooth-scroll">
      <Header />

      {/* Fixed Search Bar for authenticated users */}
      <SignedIn>
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-4xl mx-auto space-y-3">
              {/* Search and Suggest Row */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Search technologies or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-12 h-11 bg-white border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-xl shadow-sm text-base placeholder:text-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-medium">
                        ×
                      </div>
                    </button>
                  )}
                </div>
                <SuggestTechnologyDialog onSuggestionSuccess={() => refetchSilent()}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11 px-4 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-medium whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Suggest</span>
                  </Button>
                </SuggestTechnologyDialog>
              </div>

              {/* Title and Stats Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Search className="h-3 w-3 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Technology Rankings</h2>
                </div>
                <div className="text-sm text-gray-500">
                  {loading ? 'Loading...' : `${filteredTechnologies.length} technologies`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>


      {/* Hero Section - Only show when signed out */}
      <SignedOut>
        <section id="hero-section" className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover the{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              economic impact
            </span>{" "}
            of open source.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Community-driven platform where developers share real experiences and quantify
            the economic value that open source technologies bring to their work and organizations.
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                Start Contributing
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
        </section>
      </SignedOut>

      {/* Categories Section - Only show when signed out */}
      <SignedOut>
        <section id="categories-section" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">We track it all!</h2>
            <p className="text-lg text-gray-600">From web frameworks to AI tools, discover impact across all categories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {impactCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </section>
      </SignedOut>

      {/* Top Technologies Section */}
      <SignedIn>
        <section className="pt-40 pb-16 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto h-[calc(100vh-16rem)] overflow-y-auto scrollbar-thin">
              <div className="space-y-4">
                {filteredTechnologies.map((tech, index) => {
                  const rank = index + 1
                  const color = technologyColors[index % technologyColors.length]
                  const maxImpact = Math.max(...filteredTechnologies.map(t => t.total_impact), 1)

                  return (
                    <Card key={tech.id} className="tech-card hover:shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${color} text-white font-bold text-lg shadow-lg`}>
                              #{rank}
                            </div>
                            <div>
                              <CardTitle className="text-2xl text-gray-900 mb-1">{tech.name}</CardTitle>
                              <CardDescription className="text-gray-600 text-base">
                                {tech.vote_count} community contributions
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {formatCurrency(tech.total_impact)}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                              Economic Impact
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                              <div
                                className={`bg-gradient-to-r ${color} h-3 rounded-full progress-bar shadow-sm`}
                                style={{ width: `${maxImpact > 0 ? (tech.total_impact / maxImpact) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                          <VoteDialog
                            technologyId={tech.id}
                            technologyName={tech.name}
                            onVoteSuccess={handleVoteSuccess}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-medium"
                            >
                              Vote
                            </Button>
                          </VoteDialog>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {searchTerm && filteredTechnologies.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No technologies found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or browse all technologies.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </SignedIn>

      <SignedOut>
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Impact Rankings</h2>
              <p className="text-lg text-gray-600">Technologies making the biggest economic difference right now.</p>
            </div>

            {loading ? (
              <div className="max-w-4xl mx-auto space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-0 bg-white/80">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading technologies: {error}</p>
                <Button onClick={refetch} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="space-y-4">
                  {filteredTechnologies.map((tech, index) => {
                    const rank = index + 1
                    const color = technologyColors[index % technologyColors.length]
                    const maxImpact = Math.max(...filteredTechnologies.map(t => t.total_impact), 1)

                    return (
                      <Card key={tech.id} className="tech-card hover:shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${color} text-white font-bold text-lg shadow-lg`}>
                                #{rank}
                              </div>
                              <div>
                                <CardTitle className="text-2xl text-gray-900 mb-1">{tech.name}</CardTitle>
                                <CardDescription className="text-gray-600 text-base">
                                  {tech.vote_count} community contributions
                                </CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {formatCurrency(tech.total_impact)}
                              </div>
                              <div className="text-sm text-gray-500 font-medium">
                                Economic Impact
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                <div
                                  className={`bg-gradient-to-r ${color} h-3 rounded-full progress-bar shadow-sm`}
                                  style={{ width: `${maxImpact > 0 ? (tech.total_impact / maxImpact) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {searchTerm && filteredTechnologies.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No technologies found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search or browse all technologies.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm('')}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Ready to share your experience?
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Join our community and help quantify the real impact of open source technologies.
              </p>
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3">
                  Sign in with GitHub
                </Button>
              </SignInButton>
            </div>
          </div>
        </section>
      </SignedOut>

      {/* Footer */}
      <Footer />
    </div>
  );
}
