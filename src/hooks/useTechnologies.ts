'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface TechnologyRanking {
  id: number
  name: string
  description: string | null
  category: string
  vote_count: number
  average_impact: number
  total_impact: number
  created_at: string
  updated_at: string
}

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<TechnologyRanking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTechnologies = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const { data, error } = await supabase
        .from('technology_rankings')
        .select('*')
        .order('total_impact', { ascending: false })

      if (error) {
        throw error
      }

      setTechnologies(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchTechnologies()
  }, [])

  return {
    technologies,
    loading,
    error,
    refetch: () => fetchTechnologies(true),
    refetchSilent: () => fetchTechnologies(false)
  }
}

export function useTechnologyById(id: number) {
  const [technology, setTechnology] = useState<TechnologyRanking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTechnology = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('technology_rankings')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          throw error
        }

        setTechnology(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTechnology()
    }
  }, [id])

  return {
    technology,
    loading,
    error
  }
}