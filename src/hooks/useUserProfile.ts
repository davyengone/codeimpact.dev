'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface UserVote {
  id: number
  impact_value: number
  reasoning: string | null
  created_at: string
  updated_at: string
  technology: {
    id: number
    name: string
    category: string
  }
}

export interface UserProfile {
  userId: string
  totalRevenue: number
  voteCount: number
  votes: UserVote[]
  topTechnologies: Array<{
    name: string
    category: string
    impact: number
  }>
}

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)

        // Fetch user votes with technology information
        const { data: votes, error: votesError } = await supabase
          .from('votes')
          .select(`
            id,
            impact_value,
            reasoning,
            created_at,
            updated_at,
            technologies (
              id,
              name,
              category
            )
          `)
          .eq('user_id', userId)
          .order('impact_value', { ascending: false })

        if (votesError) {
          throw votesError
        }

        if (!votes || votes.length === 0) {
          setProfile({
            userId,
            totalRevenue: 0,
            voteCount: 0,
            votes: [],
            topTechnologies: []
          })
          return
        }

        // Calculate total revenue and format votes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedVotes: UserVote[] = votes.map((vote: any) => ({
          id: vote.id,
          impact_value: vote.impact_value,
          reasoning: vote.reasoning,
          created_at: vote.created_at,
          updated_at: vote.updated_at,
          technology: {
            id: vote.technologies.id,
            name: vote.technologies.name,
            category: vote.technologies.category
          }
        }))

        const totalRevenue = formattedVotes.reduce((sum, vote) => sum + vote.impact_value, 0)

        // Get top technologies
        const topTechnologies = formattedVotes
          .sort((a, b) => b.impact_value - a.impact_value)
          .slice(0, 5)
          .map(vote => ({
            name: vote.technology.name,
            category: vote.technology.category,
            impact: vote.impact_value
          }))

        setProfile({
          userId,
          totalRevenue,
          voteCount: formattedVotes.length,
          votes: formattedVotes,
          topTechnologies
        })

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserProfile()
    }
  }, [userId])

  return {
    profile,
    loading,
    error
  }
}