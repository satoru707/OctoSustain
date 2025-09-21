"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, Trophy, Target } from "lucide-react";
import { toast } from "sonner";

interface ChallengeProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: {
    id: string;
    name: string;
    progress: number;
    requirements: string[];
  };
}

export function ChallengeProgressModal({
  isOpen,
  onClose,
  challenge,
}: ChallengeProgressModalProps) {
  const [progress, setProgress] = useState(challenge.progress.toString());
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }
      }

      const response = await fetch(`/api/challenges/${challenge.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: Number.parseFloat(progress),
          notes,
          imageUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        onClose();
        // Refresh the page to show updated progress
        window.location.reload();
      } else {
        toast.error("Failed to update progress");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Update Progress: {challenge.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Progress */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Progress</label>
            <div className="flex items-center gap-4">
              <Progress
                value={Number.parseFloat(progress)}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Requirements</label>
            <div className="grid gap-2">
              {challenge.requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                >
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Progress Notes</label>
            <Textarea
              placeholder="Describe your progress, challenges, and achievements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Progress Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Progress"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload progress photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Updating..." : "Update Progress"}
              <Trophy className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
