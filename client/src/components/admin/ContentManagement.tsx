import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Edit, Trash2, Filter, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { insertContentSchema, Content } from "@shared/schema";

// Form schema with validation
const formSchema = insertContentSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnailUrl: z.string().url("Please enter a valid URL"),
  contentUrl: z.string().url("Please enter a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContentManagement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<{
    type: string | null;
    accessLevel: string | null;
  }>({
    type: null,
    accessLevel: null,
  });

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "video",
      accessLevel: "free",
      thumbnailUrl: "",
      contentUrl: "",
      duration: null,
      categories: null,
      isPublished: true,
    },
  });

  // Fetch content
  const { data: content, isLoading: isContentLoading } = useQuery({
    queryKey: ["/api/content"],
    queryFn: () => apiRequest("GET", "/api/content").then((res) => res.json()),
  });

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: () => apiRequest("GET", "/api/categories").then((res) => res.json()),
  });

  // Create content mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest("POST", "/api/content", data).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content created",
        description: "The content has been successfully created.",
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update content mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormValues & { id: number }) => {
      return apiRequest("PATCH", `/api/content/${data.id}`, data).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content updated",
        description: "The content has been successfully updated.",
      });
      form.reset();
      setEditingContent(null);
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete content mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/content/${id}`).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content deleted",
        description: "The content has been successfully deleted.",
      });
      setContentToDelete(null);
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(values: FormValues) {
    if (editingContent) {
      updateMutation.mutate({ ...values, id: editingContent.id });
    } else {
      createMutation.mutate(values);
    }
  }

  // Edit content handler
  function handleEdit(content: Content) {
    setEditingContent(content);
    form.reset({
      title: content.title,
      description: content.description,
      type: content.type,
      accessLevel: content.accessLevel,
      thumbnailUrl: content.thumbnailUrl,
      contentUrl: content.contentUrl,
      duration: content.duration,
      categories: content.categories,
      isPublished: content.isPublished,
    });
    setIsDialogOpen(true);
  }

  // Delete content handler
  function handleDelete(content: Content) {
    setContentToDelete(content);
    setIsDeleteDialogOpen(true);
  }

  // Dialog open/close handler
  function handleDialogChange(open: boolean) {
    if (!open) {
      form.reset();
      setEditingContent(null);
    }
    setIsDialogOpen(open);
  }

  // Filter content based on search and filters
  const filteredContent = content
    ? content.filter((item: Content) => {
        const matchesSearch = searchQuery
          ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesType = filter.type ? item.type === filter.type : true;
        const matchesAccessLevel = filter.accessLevel
          ? item.accessLevel === filter.accessLevel
          : true;

        return matchesSearch && matchesType && matchesAccessLevel;
      })
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Content Management</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Content
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search content..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filter.type || ""}
                onValueChange={(value) =>
                  setFilter({ ...filter, type: value || null })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filter.accessLevel || ""}
                onValueChange={(value) =>
                  setFilter({ ...filter, accessLevel: value || null })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Access Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content table */}
          {isContentLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.length > 0 ? (
                    filteredContent.map((item: Content) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.title}
                          {!item.isPublished && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                              Draft
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              item.type === "video"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              item.accessLevel === "premium"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.accessLevel}
                          </span>
                        </TableCell>
                        <TableCell>{item.views || 0}</TableCell>
                        <TableCell>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {content && content.length > 0
                          ? "No content found matching filters"
                          : "No content found. Add some content to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Content Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? "Edit Content" : "Add New Content"}
            </DialogTitle>
            <DialogDescription>
              {editingContent
                ? "Update the details of your content"
                : "Fill in the details to add new content"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="photo">Photo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter thumbnail URL" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL for the content thumbnail image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter content URL" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL for the actual content (video or photo)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value ? true : false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Publish Content</FormLabel>
                      <FormDescription>
                        This content will be visible to users
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                      {editingContent ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    <span>{editingContent ? "Update" : "Create"}</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the content &quot;
              {contentToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => contentToDelete && deleteMutation.mutate(contentToDelete.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}