'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Lightbulb } from 'lucide-react'

const categories = [
  'Web Development',
  'DevOps & Infrastructure',
  'Programming Languages',
  'Data & Analytics',
  'Machine Learning',
  'Mobile Development',
  'Development Tools',
  'Backend Development'
]

interface SuggestTechnologyDialogProps {
  children: React.ReactNode
  onSuggestionSuccess?: () => void
}

export default function SuggestTechnologyDialog({
  children,
  onSuggestionSuccess
}: SuggestTechnologyDialogProps) {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    impactValue: '',
    reasoning: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      toast.error('You must be signed in to suggest technologies')
      return
    }

    if (!formData.name.trim() || !formData.category || !formData.impactValue) {
      toast.error('Please fill in all required fields')
      return
    }

    const impactValue = parseInt(formData.impactValue)
    if (isNaN(impactValue) || impactValue < 0) {
      toast.error('Impact value must be a positive number')
      return
    }

    setSubmitting(true)

    try {
      console.log('Creating suggestion with user ID:', user.id)

      const { error } = await supabase
        .from('technology_suggestions')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          category: formData.category,
          initial_impact_value: impactValue,
          initial_vote_reasoning: formData.reasoning.trim() || null
        })

      if (error) throw error

      toast.success('Technology suggestion submitted! It will be reviewed by an admin.')

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        impactValue: '',
        reasoning: ''
      })

      setOpen(false)
      onSuggestionSuccess?.()

    } catch (error) {
      console.error('Error submitting suggestion:', error)
      toast.error('Failed to submit suggestion. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            Suggest New Technology
          </DialogTitle>
          <DialogDescription>
            Suggest a new technology for the community to vote on. Your suggestion will be reviewed by an admin before being added to the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Technology Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Next.js, TensorFlow, Docker"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what this technology does..."
              rows={3}
              className="w-full resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <Label className="text-sm font-medium">Your Initial Vote</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impactValue" className="text-sm font-medium">
                Economic Impact Value (in dollars) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="impactValue"
                type="number"
                min="0"
                step="1"
                value={formData.impactValue}
                onChange={(e) => setFormData(prev => ({ ...prev, impactValue: e.target.value }))}
                placeholder="e.g., 50000"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Estimate how much economic value this technology has provided to you or your organization
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reasoning" className="text-sm font-medium">
                Reasoning
              </Label>
              <Textarea
                id="reasoning"
                value={formData.reasoning}
                onChange={(e) => setFormData(prev => ({ ...prev, reasoning: e.target.value }))}
                placeholder="Explain why this technology has been valuable..."
                rows={3}
                className="w-full resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {submitting ? 'Submitting...' : 'Submit Suggestion'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}