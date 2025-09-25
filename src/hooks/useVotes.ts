'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase, type Vote, type VoteWithTechnology } from '@/lib/supabase'

export function useVotes() {
  const [votes, setVotes] = useState<VoteWithTechnology[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const fetchVotes = async () => {
    if (!user?.id) {
      setVotes([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('votes')
        .select(`
          *,
          technologies (
            id,
            name,
            description,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setVotes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVotes()
  }, [user?.id])

  return {
    votes,
    loading,
    error,
    refetch: fetchVotes
  }
}

export function useCreateVote() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const createVote = async (technologyId: number, impactValue: number, reasoning?: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to vote')
    }

    try {
      setLoading(true)
      setError(null)

      console.log('Creating vote with:', {
        user_id: user.id,
        technology_id: technologyId,
        impact_value: impactValue,
        reasoning: reasoning || null
      })

      const { data, error } = await supabase
        .from('votes')
        .upsert({
          user_id: user.id,
          technology_id: technologyId,
          impact_value: impactValue,
          reasoning: reasoning || null,
          updated_at: new Date().toISOString()
        })
        .select()

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data?.[0] || data
    } catch (err) {
      console.error('Vote creation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    createVote,
    loading,
    error
  }
}

export function useUserVote(technologyId: number) {
  const [vote, setVote] = useState<Vote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchUserVote = async () => {
      if (!user?.id || !technologyId) {
        setVote(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('votes')
          .select('*')
          .eq('user_id', user.id)
          .eq('technology_id', technologyId)
          .maybeSingle()

        if (error) {
          throw error
        }

        setVote(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUserVote()
  }, [user?.id, technologyId])

  return {
    vote,
    loading,
    error
  }
}