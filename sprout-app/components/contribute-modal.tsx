"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { contributeToGroupSavings } from "@/app/actions/group-savings"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ContributeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goalName: string
  goalId: string
  childId: string
}

export function ContributeModal({ open, onOpenChange, goalName, goalId, childId }: ContributeModalProps) {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    const result = await contributeToGroupSavings(childId, goalId, Number.parseFloat(amount))
    setLoading(false)

    if (result.success) {
      toast.success("Contribution successful!")
      onOpenChange(false)
      setAmount("")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to contribute")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Contribute</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Contribute to your group savings</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={loading}
              className="bg-secondary"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6"
            disabled={loading}
          >
            {loading ? "Contributing..." : "Contribute"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
