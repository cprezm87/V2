"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, ArrowUpDown, MoreHorizontal, Star, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FigureItem {
  id: string
  name: string
  type: string
  franchise: string
  brand: string
  serie: string
  yearReleased: string
  condition: string
  price: string
  yearPurchase: string
  upc: string
  logo: string
  photo: string
  tagline: string
  review: string
  shelf: string
  display: string
  ranking: number
  comments: string
}

export default function ChecklistPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<FigureItem[]>([])
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<FigureItem | null>(null)
  const [editItem, setEditItem] = useState<FigureItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Load items from localStorage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem("figureItems")
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
  }, [])

  // Filter items by type and search term
  const getFilteredItems = (type: string) => {
    return items
      .filter(
        (item) =>
          item.type.toLowerCase() === type.toLowerCase() &&
          (searchTerm === "" ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.franchise.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => {
        if (sortBy === "name" || sortBy === "franchise" || sortBy === "brand") {
          return sortOrder === "asc" ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy])
        } else if (sortBy === "price" || sortBy === "yearReleased" || sortBy === "yearPurchase") {
          return sortOrder === "asc"
            ? Number.parseInt(a[sortBy]) - Number.parseInt(b[sortBy])
            : Number.parseInt(b[sortBy]) - Number.parseInt(a[sortBy])
        } else {
          // Default sort by name
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        }
      })
  }

  // Handle item deletion
  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    localStorage.setItem("figureItems", JSON.stringify(updatedItems))
    toast({
      title: "Deleted!",
      description: "Item has been removed from your checklist.",
    })
  }

  // Handle item edit
  const handleEditItem = (item: FigureItem) => {
    setEditItem({ ...item })
    setIsEditDialogOpen(true)
  }

  // Save edited item
  const saveEditedItem = () => {
    if (editItem) {
      const updatedItems = items.map((item) => (item.id === editItem.id ? editItem : item))
      setItems(updatedItems)
      localStorage.setItem("figureItems", JSON.stringify(updatedItems))
      setIsEditDialogOpen(false)
      setEditItem(null)
      toast({
        title: "Updated!",
        description: "Item has been updated successfully.",
      })
    }
  }

  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Render stars for ranking
  const renderStars = (ranking: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < ranking ? "fill-neon-green text-neon-green" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    )
  }

  // Render item dialog content
  const renderItemDialogContent = (item: FigureItem) => (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      {item.logo && (
        <div className="w-full">
          <div className="relative h-32 w-full overflow-hidden">
            <img
              src={item.logo || "/placeholder.svg"}
              alt={`${item.franchise} logo`}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Name and Tagline */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-neon-green">{item.name}</h3>
        {item.tagline && <p className="text-base italic">{item.tagline}</p>}
      </div>

      {/* Photo */}
      {item.photo && (
        <div className="w-full">
          <div className="relative h-80 w-full overflow-hidden">
            <img src={item.photo || "/placeholder.svg"} alt={item.name} className="object-contain" />
          </div>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-neon-green">
            ID: <span className="font-normal text-white">{item.id}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Brand: <span className="font-normal text-white">{item.brand}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Serie: <span className="font-normal text-white">{item.serie || "N/A"}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Franchise: <span className="font-normal text-white">{item.franchise}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Year Released: <span className="font-normal text-white">{item.yearReleased}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Condition: <span className="font-normal text-white">{item.condition}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Price:{" "}
            <span className="font-normal text-white">${Number.parseInt(item.price).toLocaleString("es-CO")}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Year Purchase: <span className="font-normal text-white">{item.yearPurchase}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            UPC: <span className="font-normal text-white">{item.upc || "N/A"}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Shelf: <span className="font-normal text-white">{item.shelf}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Display: <span className="font-normal text-white">{item.display}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Ranking: <span className="font-normal text-white">{renderStars(item.ranking)}</span>
          </p>
        </div>
      </div>

      {/* Review */}
      {item.review && (
        <div>
          <p className="text-sm font-medium text-neon-green mb-2">Review:</p>
          <div className="aspect-video w-full overflow-hidden relative">
            <a href={item.review} target="_blank" rel="noopener noreferrer" className="block relative">
              <div className="aspect-video w-full bg-black/20 rounded-md flex items-center justify-center">
                <img
                  src={`https://img.youtube.com/vi/${item.review.includes("youtube.com") ? item.review.split("v=")[1]?.split("&")[0] : "default"}/0.jpg`}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Comments */}
      {item.comments && (
        <div>
          <p className="text-sm font-medium text-neon-green">
            Comments: <span className="font-normal text-white">{item.comments}</span>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <Button variant="outline" onClick={() => handleEditItem(item)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDeleteItem(item.id)}
          className="bg-neon-green text-black hover:bg-neon-green/90"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )

  return (
    <div className="w-full py-6 px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Checklist</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search item..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sort by</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="yearReleased">Year Released</SelectItem>
              <SelectItem value="yearPurchase">Year Purchase</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>

      <Tabs defaultValue="figures" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="figures" className="flex-1">
            Figures
          </TabsTrigger>
          <TabsTrigger value="accessories" className="flex-1">
            Accessories
          </TabsTrigger>
          <TabsTrigger value="props" className="flex-1">
            Props
          </TabsTrigger>
        </TabsList>

        <TabsContent value="figures">
          <Card>
            <CardContent className="space-y-2 pt-6">
              {getFilteredItems("figures").length > 0 ? (
                getFilteredItems("figures").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="font-medium truncate cursor-pointer hover:text-neon-green">{item.name}</span>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader></DialogHeader>
                        {renderItemDialogContent(item)}
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#111] border-[#222]">
                        <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                          Copy ID
                        </DropdownMenuItem>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                              View details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader></DialogHeader>
                            {renderItemDialogContent(item)}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={() => handleEditItem(item)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-neon-green focus:text-black focus:bg-neon-green"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No figures found. Add some figures to your collection!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessories">
          <Card>
            <CardContent className="space-y-2 pt-6">
              {getFilteredItems("accessories").length > 0 ? (
                getFilteredItems("accessories").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="font-medium truncate cursor-pointer hover:text-neon-green">{item.name}</span>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader></DialogHeader>
                        {renderItemDialogContent(item)}
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#111] border-[#222]">
                        <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                          Copy ID
                        </DropdownMenuItem>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                              View details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader></DialogHeader>
                            {renderItemDialogContent(item)}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={() => handleEditItem(item)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-neon-green focus:text-black focus:bg-neon-green"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No accessories found. Add some accessories to your collection!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="props">
          <Card>
            <CardContent className="space-y-2 pt-6">
              {getFilteredItems("props").length > 0 ? (
                getFilteredItems("props").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="font-medium truncate cursor-pointer hover:text-neon-green">{item.name}</span>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader></DialogHeader>
                        {renderItemDialogContent(item)}
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#111] border-[#222]">
                        <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                          Copy ID
                        </DropdownMenuItem>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                              View details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader></DialogHeader>
                            {renderItemDialogContent(item)}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={() => handleEditItem(item)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-neon-green focus:text-black focus:bg-neon-green"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No props found. Add some props to your collection!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-franchise">Franchise</Label>
                  <Input
                    id="edit-franchise"
                    value={editItem.franchise}
                    onChange={(e) => setEditItem({ ...editItem, franchise: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Input
                    id="edit-brand"
                    value={editItem.brand}
                    onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-serie">Serie</Label>
                  <Input
                    id="edit-serie"
                    value={editItem.serie}
                    onChange={(e) => setEditItem({ ...editItem, serie: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    value={editItem.price}
                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-condition">Condition</Label>
                  <Input
                    id="edit-condition"
                    value={editItem.condition}
                    onChange={(e) => setEditItem({ ...editItem, condition: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-logo">Logo URL</Label>
                  <Input
                    id="edit-logo"
                    value={editItem.logo}
                    onChange={(e) => setEditItem({ ...editItem, logo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-photo">Photo URL</Label>
                  <Input
                    id="edit-photo"
                    value={editItem.photo}
                    onChange={(e) => setEditItem({ ...editItem, photo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tagline">Tagline</Label>
                  <Input
                    id="edit-tagline"
                    value={editItem.tagline}
                    onChange={(e) => setEditItem({ ...editItem, tagline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-review">Review URL</Label>
                  <Input
                    id="edit-review"
                    value={editItem.review}
                    onChange={(e) => setEditItem({ ...editItem, review: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-comments">Comments</Label>
                <Textarea
                  id="edit-comments"
                  value={editItem.comments}
                  onChange={(e) => setEditItem({ ...editItem, comments: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={saveEditedItem} className="bg-neon-green text-black hover:bg-neon-green/90">
              <Edit className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
