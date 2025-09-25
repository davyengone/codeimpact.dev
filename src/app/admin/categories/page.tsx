'use client'

import { useState, useEffect } from 'react'
import AdminNav from '@/components/AdminNav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/formatRevenue'
import { Plus, Edit2, Trash2, Database } from 'lucide-react'

interface CategoryStats {
  category: string
  technology_count: number
  vote_count: number
  total_impact: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryStats[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)

      // Get category statistics
      const { data, error } = await supabase
        .from('technology_rankings')
        .select('category, vote_count, total_impact')

      if (error) {
        throw error
      }

      // Group by category and calculate stats
      const categoryMap = new Map<string, CategoryStats>()

      data?.forEach(item => {
        if (categoryMap.has(item.category)) {
          const existing = categoryMap.get(item.category)!
          existing.technology_count += 1
          existing.vote_count += item.vote_count
          existing.total_impact += item.total_impact
        } else {
          categoryMap.set(item.category, {
            category: item.category,
            technology_count: 1,
            vote_count: item.vote_count,
            total_impact: item.total_impact
          })
        }
      })

      setCategories(Array.from(categoryMap.values()).sort((a, b) => b.total_impact - a.total_impact))
    } catch (error) {
      console.error('Failed to load categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      setActionLoading(true)

      if (editingCategory) {
        // Update existing category - update all technologies with this category
        const { error } = await supabase
          .from('technologies')
          .update({ category: categoryName.trim() })
          .eq('category', editingCategory)

        if (error) {
          throw error
        }

        toast.success('Category updated successfully!')
      } else {
        // Create new category by adding a placeholder technology
        // In real use, you'd probably want a separate categories table
        toast.info('To create a new category, add a technology with this category name')
      }

      setDialogOpen(false)
      resetForm()
      loadCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
      toast.error('Failed to save category')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (categoryName: string) => {
    setEditingCategory(categoryName)
    setCategoryName(categoryName)
    setDialogOpen(true)
  }

  const handleDelete = async (categoryName: string) => {
    const category = categories.find(c => c.category === categoryName)
    if (!category) return

    if (category.technology_count > 0) {
      toast.error('Cannot delete category with existing technologies')
      return
    }

    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
      try {
        setActionLoading(true)

        // In a real app, you'd delete from a categories table
        // For now, we just show a message
        toast.error('Delete functionality requires migrating technologies first')
      } catch (error) {
        toast.error('Failed to delete category')
      } finally {
        setActionLoading(false)
      }
    }
  }

  const resetForm = () => {
    setCategoryName('')
    setEditingCategory(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNav />

      <div className="flex-1 overflow-hidden">
        <div className="md:hidden">
          <AdminNav />
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Category
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? 'Edit Category' : 'Category Management'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingCategory
                          ? 'Update the category name. This will affect all technologies in this category.'
                          : 'Categories are created automatically when you add technologies. Use the Technologies page to create new categories.'
                        }
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          placeholder="e.g., Web Development"
                          required={!!editingCategory}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleDialogClose}>
                          Cancel
                        </Button>
                        {editingCategory && (
                          <Button type="submit" disabled={actionLoading}>
                            {actionLoading ? 'Updating...' : 'Update Category'}
                          </Button>
                        )}
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Overview</CardTitle>
                  <CardDescription>
                    Technology categories and their statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <Card key={category.category} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{category.category}</CardTitle>
                                <CardDescription>
                                  {category.technology_count} technologies
                                </CardDescription>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(category.category)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(category.category)}
                                  className="text-red-600 hover:text-red-700"
                                  disabled={category.technology_count > 0}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Total Votes:</span>
                                <span className="font-medium">{category.vote_count}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Total Impact:</span>
                                <span className="font-medium">
                                  {formatCurrency(category.total_impact)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Avg per Tech:</span>
                                <span className="font-medium">
                                  {formatCurrency(Math.round(category.total_impact / category.technology_count))}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {!loading && categories.length === 0 && (
                    <div className="text-center py-8">
                      <Database className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add technologies to create categories automatically.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}