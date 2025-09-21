"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Upload,
  Search,
  Trash2,
  Tag,
  FolderOpen,
  ImageIcon,
  FileText,
  File,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

interface FileManagerProps {
  podId?: string;
  challengeId?: string;
  category?: string;
  onFileSelect?: (file) => void;
  allowMultiple?: boolean;
}

export function FileManager({
  podId,
  challengeId,
  category,
  onFileSelect,
  allowMultiple = false,
}: FileManagerProps) {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState(category || "all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (podId) params.append("podId", podId);
        if (challengeId) params.append("challengeId", challengeId);
        if (filterCategory !== "all") params.append("category", filterCategory);

        const response = await fetch(`/api/files?${params}`);
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files);
        }
      } catch {
        toast.error("Failed to load files");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, [podId, challengeId, filterCategory]);

  const handleFileSelect = (fileId: string) => {
    if (allowMultiple) {
      setSelectedFiles((prev) =>
        prev.includes(fileId)
          ? prev.filter((id) => id !== fileId)
          : [...prev, fileId]
      );
    } else {
      const file = files.find((f) => f.id === fileId);
      if (file && onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleBulkAction = async (action, data) => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }

    try {
      const response = await fetch("/api/files/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          fileIds: selectedFiles,
          data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setSelectedFiles([]);
      } else {
        toast.error("Bulk action failed");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type === "application/pdf") return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const filteredFiles = files.filter(
    (file) =>
      file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">File Manager</h3>
        <Button
          onClick={() => setShowUpload(true)}
          className="bg-eco-primary hover:bg-eco-primary/90"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="waste">Waste</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedFiles.length} files selected
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction("delete")}
          >
            <Trash2 className="mr-2 h-3 w-3" />
            Delete
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction("tag", { tags: ["bulk-tagged"] })}
          >
            <Tag className="mr-2 h-3 w-3" />
            Tag
          </Button>
        </div>
      )}

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedFiles.includes(file.id)
                ? "border-eco-primary bg-eco-primary/5"
                : "hover:border-muted-foreground/50"
            }`}
            onClick={() => handleFileSelect(file.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {allowMultiple && (
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                  />
                )}
                {getFileIcon(file.type)}
              </div>
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {file.thumbnailUrl && (
              <img
                src={file.thumbnailUrl || "/placeholder.svg"}
                alt={file.originalName}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}

            <div className="space-y-1">
              <p className="text-sm font-medium truncate">
                {file.originalName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {file.category}
                </Badge>
                {file.tags?.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No files found</p>
        </div>
      )}
    </div>
  );
}
