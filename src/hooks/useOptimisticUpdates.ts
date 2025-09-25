'use client'

import { useState, useEffect } from 'react'
import { TechnologyRanking } from './useTechnologies'

export function useOptimisticUpdates(technologies: TechnologyRanking[]) {
  const [optimisticTechnologies, setOptimisticTechnologies] = useState<TechnologyRanking[]>(technologies)

  // Update optimistic state when real technologies change
  useEffect(() => {
    setOptimisticTechnologies(technologies)
  }, [technologies])

  // Update optimistic state immediately when user votes
  const addOptimisticVote = (technologyId: number, impactValue: number, isUpdate: boolean = false) => {
    setOptimisticTechnologies(current =>
      current.map(tech => {
        if (tech.id === technologyId) {
          // Calculate new values optimistically
          const newVoteCount = isUpdate ? tech.vote_count : tech.vote_count + 1
          const newTotalImpact = isUpdate
            ? tech.total_impact // We don't know the old value, so keep current
            : tech.total_impact + impactValue
          const newAverageImpact = newTotalImpact / newVoteCount

          return {
            ...tech,
            vote_count: newVoteCount,
            total_impact: newTotalImpact,
            average_impact: newAverageImpact
          }
        }
        return tech
      }).sort((a, b) => b.total_impact - a.total_impact) // Re-sort by total impact
    )
  }

  // Sync with real data when it arrives
  const syncWithRealData = (realTechnologies: TechnologyRanking[]) => {
    setOptimisticTechnologies(realTechnologies)
  }

  return {
    optimisticTechnologies,
    addOptimisticVote,
    syncWithRealData
  }
}