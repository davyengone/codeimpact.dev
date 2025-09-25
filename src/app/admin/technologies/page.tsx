'use client'

import { useState, useEffect } from 'react'
import AdminNav from '@/components/AdminNav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAdminTechnologies, type Technology } from '@/hooks/useAdminTechnologies'
import { Plus, Edit2, Trash2 } from 'lucide-react'

const CATEGORIES = [
  'Web Development',
  'Backend Development',
  'DevOps & Infrastructure',
  'Programming Languages',
  'Data & Analytics',
  'Machine Learning',
  'Mobile Development',
  'Development Tools'
]

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<Technology | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: CATEGORIES[0]
  })

  const {
    createTechnology,
    updateTechnology,
    deleteTechnology,
    getAllTechnologies,
    loading: actionLoading
  } = useAdminTechnologies()

  useEffect(() => {
    loadTechnologies()
  }, [])

  const loadTechnologies = async () => {
    try {
      const data = await getAllTechnologies()
      setTechnologies(data)
    } catch (error) {
      console.error('Failed to load technologies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingTech) {
        await updateTechnology(editingTech.id, formData.name, formData.description, formData.category)
      } else {
        await createTechnology(formData.name, formData.description, formData.category)
      }

      setDialogOpen(false)
      resetForm()
      loadTechnologies()
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleEdit = (tech: Technology) => {
    setEditingTech(tech)
    setFormData({
      name: tech.name,
      description: tech.description || '',
      category: tech.category
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this technology? This action cannot be undone.')) {
      try {
        await deleteTechnology(id)
        loadTechnologies()
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: CATEGORIES[0]
    })
    setEditingTech(null)
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
                <h1 className="text-2xl font-semibold text-gray-900">Technologies</h1>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Technology
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTech ? 'Edit Technology' : 'Add New Technology'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingTech
                          ? 'Update the technology details below.'
                          : 'Add a new technology to the platform.'
                        }
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., React"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the technology"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          {CATEGORIES.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleDialogClose}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={actionLoading}>
                          {actionLoading ? 'Saving...' : editingTech ? 'Update' : 'Create'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Technologies</CardTitle>
                  <CardDescription>
                    Manage technologies available on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {technologies.map((tech) => (
                          <TableRow key={tech.id}>
                            <TableCell className="font-medium">{tech.name}</TableCell>
                            <TableCell>{tech.category}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {tech.description || '-'}
                            </TableCell>
                            <TableCell>
                              {new Date(tech.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(tech)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(tech.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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