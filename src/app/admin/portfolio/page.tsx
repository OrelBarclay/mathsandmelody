"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { PortfolioItem } from "@/lib/services/admin-service"
import { Loader2, Plus, Pencil, Trash, Link as LinkIcon, Eye } from "lucide-react"
import Image from "next/image"
export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const response = await fetch("/api/admin/portfolio")
      if (!response.ok) throw new Error("Failed to fetch portfolio items")
      const data = await response.json()
      setItems(data.items)
    } catch (error) {
      console.error("Error loading portfolio items:", error)
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as "math" | "music" | "sports",
      image: formData.get("image") as string,
      link: formData.get("link") as string,
    }

    try {
      const url = selectedItem
        ? `/api/admin/portfolio/${selectedItem.id}`
        : "/api/admin/portfolio"
      const method = selectedItem ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save portfolio item")

      await loadItems()
      setIsDialogOpen(false)
      setSelectedItem(null)
      toast({
        title: "Success",
        description: `Portfolio item ${selectedItem ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      console.error("Error saving portfolio item:", error)
      toast({
        title: "Error",
        description: "Failed to save portfolio item",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return

    try {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete portfolio item")

      await loadItems()
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting portfolio item:", error)
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Portfolio Management</h1>
            <Button variant="outline" size="sm" asChild>
              <a href="/portfolio" target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                View Portfolio
              </a>
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Portfolio Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedItem ? "Edit Portfolio Item" : "Add New Portfolio Item"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={selectedItem?.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={selectedItem?.description}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    defaultValue={selectedItem?.category || "math"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Math</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    defaultValue={selectedItem?.image}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">External Link</Label>
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    defaultValue={selectedItem?.link}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {selectedItem ? "Update Portfolio Item" : "Create Portfolio Item"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                        width={64}
                        height={64}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <LinkIcon className="h-4 w-4" />
                        View
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id!)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
} 