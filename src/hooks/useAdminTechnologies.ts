'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface Technology {
  id: number
  name: string
  description: string | null
  category: string
  created_at: string
  updated_at: string
}

export function useAdminTechnologies() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTechnology = async (name: string, description: string, category: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('technologies')
        .insert({
          name,
          description: description || null,
          category,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      toast.success('Technology created successfully!')
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error('Failed to create technology', {
        description: errorMessage
      })
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateTechnology = async (id: number, name: string, description: string, category: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('technologies')
        .update({
          name,
          description: description || null,
          category,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      toast.success('Technology updated successfully!')
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error('Failed to update technology', {
        description: errorMessage
      })
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteTechnology = async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      // First check if there are votes for this technology
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('id')
        .eq('technology_id', id)

      if (votesError) {
        throw votesError
      }

      if (votes && votes.length > 0) {
        throw new Error('Cannot delete technology with existing votes. Delete votes first.')
      }

      const { error } = await supabase
        .from('technologies')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      toast.success('Technology deleted successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error('Failed to delete technology', {
        description: errorMessage
      })
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getAllTechnologies = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .order('name')

      if (error) {
        throw error
      }

      return data as Technology[]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    createTechnology,
    updateTechnology,
    deleteTechnology,
    getAllTechnologies,
    loading,
    error
  }
}