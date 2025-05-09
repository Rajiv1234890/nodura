import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Content, insertContentSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

// Form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["video", "photo"]),
  accessLevel: z.enum(["free", "premium"]),
  thumbnailUrl: z.string().url("Please enter a valid URL"),
  contentUrl: z.string().url("Please enter a valid URL"),
  categories: z.string(),
  duration: z.string().optional(),
  isPublished: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContentManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const { toast } = useToast();
  
  // Fetch content data
  const { data: contentItems, isLoading } = useQuery<Content[]>({
    queryKey: ['/api/admin/content'],
  });
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "video",
      accessLevel: "free",
      thumbnailUrl: "",
      contentUrl: "",
      categories: "",
      duration: "",
      isPublished: true,
    },
  });
  
  // Create content mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Format the data for API
      const contentData = {
        ...data,
        categories: data.categories.split(',').map(cat => cat.trim()),
      };
      
      const res = await apiRequest("POST", "/api/admin/content", contentData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      toast({
        title: "Content created",
        description: "New content has been added successfully.",
      });
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create content",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update content mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormValues & { id: number }) => {
      const { id, ...contentData } = data;
      
      // Format the categories
      const formattedData = {
        ...contentData,
        categories: typeof contentData.categories === 'string' 
          ? contentData.categories.split(',').map(cat => cat.trim())
          : contentData.categories,
      };
      
      const res = await apiRequest("PUT", `/api/admin/content/${id}`, formattedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      toast({
        title: "Content updated",
        description: "Content has been updated successfully.",
      });
      setSelectedContent(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update content",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete content mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      toast({
        title: "Content deleted",
        description: "Content has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete content",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission for new content
  function onSubmit(values: FormValues) {
    if (selectedContent) {
      updateMutation.mutate({ ...values, id: selectedContent.id });
    } else {
      createMutation.mutate(values);
    }
  }
  
  // Open edit modal with pre-filled data
  function handleEdit(content: Content) {
    setSelectedContent(content);
    
    // Fill the form with existing data
    form.reset({
      title: content.title,
      description: content.description,
      type: content.type,
      accessLevel: content.accessLevel,
      thumbnailUrl: content.thumbnailUrl,
      contentUrl: content.contentUrl,
      categories: Array.isArray(content.categories) ? content.categories.join(', ') : content.categories,
      duration: content.duration || "",
      isPublished: content.isPublished,
    });
  }
  
  // Handle dialog close
  function handleDialogChange(open: boolean) {
    if (!open) {
      setSelectedContent(null);
      form.reset();
    }
    setIsAddModalOpen(open);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        
        <Dialog open={isAddModalOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Add New Content
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedContent ? "Edit Content" : "Add New Content"}</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Content title" {...field} />
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
                          <FormLabel>Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
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
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a detailed description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                        </FormControl>
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
                          <Input placeholder="https://example.com/content.mp4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <Input placeholder="nature, tutorial, landscape" {...field} />
                        </FormControl>
                        <FormDescription>
                          Separate categories with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (for videos)</FormLabel>
                        <FormControl>
                          <Input placeholder="12:34" {...field} />
                        </FormControl>
                        <FormDescription>
                          Format: mm:ss
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish Content</FormLabel>
                        <FormDescription>
                          When enabled, content will be visible to users based on access level
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {selectedContent ? "Updating..." : "Creating..."}
                      </span>
                    ) : (
                      selectedContent ? "Update Content" : "Add Content"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Content Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-8 w-36" />
            </div>
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems && contentItems.length > 0 ? (
                contentItems.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-10 w-16 rounded overflow-hidden mr-3">
                          <img 
                            src={content.thumbnailUrl} 
                            alt={content.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="truncate max-w-[250px]">{content.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={content.type === "video" ? "default" : "outline"}>
                        {content.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={content.accessLevel === "premium" ? "premium" : "free"}>
                        {content.accessLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={content.isPublished ? "default" : "outline"} className={!content.isPublished ? "bg-amber-500" : ""}>
                        {content.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(content.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(content)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this content?")) {
                              deleteMutation.mutate(content.id);
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No content found. Add your first content!</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
