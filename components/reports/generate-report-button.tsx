"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GenerateReportModal } from "@/components/reports/generate-report-modal"
import { Plus } from "lucide-react"

interface GenerateReportButtonProps {
  podId: string
}

export function GenerateReportButton({ podId }: GenerateReportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold"
      >
        <Plus className="mr-2 h-4 w-4" />
        Generate Report
      </Button>

      <GenerateReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} podId={podId} />
    </>
  )
}
