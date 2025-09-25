'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { useIsAdmin } from '@/lib/admin'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Clock, DollarSign, MessageSquare, User } from 'lucide-react'

interface TechnologySuggestion {
  id: number
  user_id: string
  name: string
  description: string | null
  category: string
  suggested_at: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  initial_impact_value: number | null
  initial_vote_reasoning: string | null
}

export default function AdminSuggestionsPage() {
  const { user } = useUser()
  const router = useRouter()
  const { isAdmin, loading: adminLoading } = useIsAdmin()

  const [suggestions, setSuggestions] = useState<TechnologySuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewDialog, setReviewDialog] = useState<{
    suggestion: TechnologySuggestion
    action: 'approve' | 'reject'
  } | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/')
      return
    }
    if (isAdmin) {
      fetchSuggestions()
    }
  }, [isAdmin, adminLoading, router])

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('technology_suggestions')
        .select('*')
        .order('suggested_at', { ascending: false })

      if (error) throw error

      setSuggestions(data || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      toast.error('Failed to load suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewAction = async (action: 'approve' | 'reject') => {
    if (!reviewDialog || !user?.id) return

    setSubmitting(true)

    try {
      if (action === 'approve') {
        // Start a transaction-like operation
        // 1. Insert technology
        const { data: newTech, error: techError } = await supabase
          .from('technologies')
          .insert({
            name: reviewDialog.suggestion.name,
            description: reviewDialog.suggestion.description,
            category: reviewDialog.suggestion.category
          })
          .select()
          .single()

        if (techError) throw techError

        // 2. Insert initial vote if provided
        if (reviewDialog.suggestion.initial_impact_value) {
          console.log('Creating vote for user:', reviewDialog.suggestion.user_id, 'on technology:', newTech.id)

          const { error: voteError } = await supabase
            .from('votes')
            .insert({
              user_id: reviewDialog.suggestion.user_id,
              technology_id: newTech.id,
              impact_value: reviewDialog.suggestion.initial_impact_value,
              reasoning: reviewDialog.suggestion.initial_vote_reasoning
            })

          if (voteError) throw voteError
        }
      }

      // 3. Update suggestion status
      const { error: updateError } = await supabase
        .from('technology_suggestions')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          admin_notes: adminNotes.trim() || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reviewDialog.suggestion.id)

      if (updateError) throw updateError

      toast.success(
        action === 'approve'
          ? 'Technology approved and added to the platform!'
          : 'Technology suggestion rejected'
      )

      // Refresh suggestions
      await fetchSuggestions()
      setReviewDialog(null)
      setAdminNotes('')

    } catch (error) {
      console.error('Error processing suggestion:', error)
      toast.error('Failed to process suggestion')
    } finally {
      setSubmitting(false)
    }
  }

  const openReviewDialog = (suggestion: TechnologySuggestion, action: 'approve' | 'reject') => {
    setReviewDialog({ suggestion, action })
    setAdminNotes('')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (adminLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending')
  const reviewedSuggestions = suggestions.filter(s => s.status !== 'pending')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Technology Suggestions</h1>
        <p className="text-gray-600">Review and approve technology suggestions from the community</p>
      </div>

      {pendingSuggestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Pending Review ({pendingSuggestions.length})
          </h2>
          <div className="space-y-4">
            {pendingSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-yellow-400">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{suggestion.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{suggestion.category}</Badge>
                        <span className="text-sm text-gray-500">
                          Suggested on {new Date(suggestion.suggested_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(suggestion.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(suggestion.status)}
                        {suggestion.status}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {suggestion.description && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                      <p className="text-gray-600">{suggestion.description}</p>
                    </div>
                  )}

                  {suggestion.initial_impact_value && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        Initial Vote
                      </h4>
                      <div className="text-lg font-semibold text-blue-600 mb-2">
                        ${suggestion.initial_impact_value.toLocaleString()}
                      </div>
                      {suggestion.initial_vote_reasoning && (
                        <p className="text-sm text-gray-600">{suggestion.initial_vote_reasoning}</p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => openReviewDialog(suggestion, 'approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => openReviewDialog(suggestion, 'reject')}
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reviewedSuggestions.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Reviewed ({reviewedSuggestions.length})
          </h2>
          <div className="space-y-4">
            {reviewedSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{suggestion.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{suggestion.category}</Badge>
                        <span className="text-sm text-gray-500">
                          Reviewed on {suggestion.reviewed_at ? new Date(suggestion.reviewed_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(suggestion.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(suggestion.status)}
                        {suggestion.status}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                {suggestion.admin_notes && (
                  <CardContent>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Admin Notes
                      </h4>
                      <p className="text-sm text-gray-600">{suggestion.admin_notes}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {suggestions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions yet</h3>
          <p className="text-gray-500">Technology suggestions from the community will appear here.</p>
        </div>
      )}

      {/* Review Dialog */}
      {reviewDialog && (
        <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {reviewDialog.action === 'approve' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                {reviewDialog.action === 'approve' ? 'Approve' : 'Reject'} Technology
              </DialogTitle>
              <DialogDescription>
                {reviewDialog.action === 'approve'
                  ? `Approving "${reviewDialog.suggestion.name}" will add it to the technology list and create the initial vote.`
                  : `Rejecting "${reviewDialog.suggestion.name}" will mark it as rejected.`
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-notes" className="text-sm font-medium">
                  Admin Notes (Optional)
                </Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about your decision..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setReviewDialog(null)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleReviewAction(reviewDialog.action)}
                disabled={submitting}
                className={
                  reviewDialog.action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }
              >
                {submitting ? 'Processing...' : (reviewDialog.action === 'approve' ? 'Approve' : 'Reject')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}