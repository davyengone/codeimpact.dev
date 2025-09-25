'use client'

import { useState, useEffect } from "react"
import { useCreateVote, useUserVote } from "@/hooks/useVotes"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface VoteDialogProps {
  technologyId: number
  technologyName: string
  children: React.ReactNode
  onVoteSuccess?: (technologyId: number, impactValue: number, isUpdate: boolean) => void
}

export default function VoteDialog({ technologyId, technologyName, children, onVoteSuccess }: VoteDialogProps) {
  const [impactValue, setImpactValue] = useState("")
  const [reasoning, setReasoning] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const { createVote, loading: submitting, error: submitError } = useCreateVote()
  const { vote: existingVote, loading: loadingVote } = useUserVote(technologyId)

  // Pre-populate form with existing vote data
  useEffect(() => {
    if (existingVote && isOpen) {
      setImpactValue(existingVote.impact_value.toString())
      setReasoning(existingVote.reasoning || "")
    }
  }, [existingVote, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const isUpdate = existingVote !== null

      await createVote(
        technologyId,
        parseInt(impactValue),
        reasoning.trim() || undefined
      )

      setIsOpen(false)
      setImpactValue("")
      setReasoning("")

      // Show success notification
      if (isUpdate) {
        toast.success(`Thank you for updating your vote for ${technologyName}!`, {
          description: `Your impact assessment of $${parseInt(impactValue).toLocaleString()} has been updated.`,
          duration: 4000
        })
      } else {
        toast.success(`Thank you for voting for ${technologyName}!`, {
          description: `Your impact assessment of $${parseInt(impactValue).toLocaleString()} has been recorded.`,
          duration: 4000
        })
      }

      // Notify parent component with vote details for optimistic updates
      if (onVoteSuccess) {
        onVoteSuccess(technologyId, parseInt(impactValue), isUpdate)
      }
    } catch (err) {
      // Show error notification
      toast.error('Failed to submit vote', {
        description: 'Please try again in a moment.',
        duration: 3000
      })
      console.error('Vote submission failed:', err)
    }
  }

  const resetForm = () => {
    if (existingVote) {
      setImpactValue(existingVote.impact_value.toString())
      setReasoning(existingVote.reasoning || "")
    } else {
      setImpactValue("")
      setReasoning("")
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">
            {existingVote ? 'Update your vote' : 'Vote'} for {technologyName}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            {existingVote
              ? `Update your impact assessment for ${technologyName}.`
              : `Share your experience with ${technologyName} and estimate its economic impact value.`
            }
          </DialogDescription>
        </DialogHeader>

        {loadingVote ? (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            Loading your existing vote...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="impact" className="text-sm font-medium dark:text-gray-200">
                Economic Impact (in USD)
              </label>
              <Input
                id="impact"
                type="number"
                placeholder="e.g., 50000"
                value={impactValue}
                onChange={(e) => setImpactValue(e.target.value)}
                required
                min="0"
                step="1000"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Estimate how much economic value this technology has brought to you or your organization
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="reasoning" className="text-sm font-medium dark:text-gray-200">
                Your Experience (Optional)
              </label>
              <Textarea
                id="reasoning"
                placeholder="Tell us about your experience with this technology..."
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={3}
              />
            </div>

            {submitError && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded">
                {submitError}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : existingVote ? 'Update Vote' : 'Submit Vote'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}