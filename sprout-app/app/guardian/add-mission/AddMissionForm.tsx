"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { X } from "lucide-react"
import { createMission } from "@/app/actions/missions"
import { toast } from "sonner"

interface AddMissionFormProps {
  childId: string | null
  guardianId: string
}

export default function AddMissionForm({ childId, guardianId }: AddMissionFormProps) {
  const router = useRouter()
  const [missionName, setMissionName] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [reward, setReward] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!childId || !guardianId) {
      toast.error("Missing required information")
      return
    }

    setLoading(true)
    const result = await createMission({
      childId,
      guardianId,
      name: missionName,
      description,
      deadline,
      rewardAmount: Number.parseFloat(reward),
    })
    setLoading(false)

    if (result.success) {
      toast.success("Mission created!")
      router.push("/guardian/dashboard")
    } else {
      toast.error(result.error || "Failed to create mission")
    }
  }

  return (
    <div className="min-h-screen bg-white/95 backdrop-blur-sm flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Add Mission</h2>
            <Link href="/guardian/dashboard">
              <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Assign a mission to your child
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="missionName">Mission Name</Label>
              <Input
                id="missionName"
                type="text"
                placeholder="Enter mission name"
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
                required
                disabled={loading}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mission Description</Label>
              <Textarea
                id="description"
                placeholder="Enter mission description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="bg-white min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                disabled={loading}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward">Reward Amount</Label>
              <Input
                id="reward"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter reward amount"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                required
                disabled={loading}
                className="bg-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Mission"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
