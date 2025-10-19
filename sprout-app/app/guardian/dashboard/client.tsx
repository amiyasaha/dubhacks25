"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PiggyBank } from "@/components/piggy-bank"
import { Plus } from "lucide-react"
import { TransferMoneyModal } from "@/components/transfer-money-modal"
import Link from "next/link"
import { approveMission, rejectMission } from "@/app/actions/missions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Child {
  id: string
  childId: string
  name: string
  balance: number
  creditScore: number
  missions: {
    reviewing: number
    done: number
    pending: number
  }
  pendingMissions: Array<{
    id: string
    name: string
    reward: number
    deadline: string
  }>
}

interface Mission {
  id: string
  childId: string
  childName: string
  missionName: string
  reward: number
}

interface GuardianDashboardClientProps {
  guardianName: string
  children: Child[]
  missionsAwaitingApproval: Mission[]
}

export function GuardianDashboardClient({
  guardianName,
  children,
  missionsAwaitingApproval,
}: GuardianDashboardClientProps) {
  const router = useRouter()
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(false)

  const handleApprove = async (missionId: string) => {
    setLoading(true)
    const result = await approveMission(missionId)
    setLoading(false)

    if (result.success) {
      toast.success("Mission approved!")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to approve mission")
    }
  }

  const handleReject = async (missionId: string) => {
    setLoading(true)
    const result = await rejectMission(missionId)
    setLoading(false)

    if (result.success) {
      toast.success("Mission rejected")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to reject mission")
    }
  }

  const handleTransfer = (child: Child) => {
    setSelectedChild(child)
    setTransferModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-2xl font-bold">{guardianName}!</p>
          </div>
          <div className="w-16 h-16 bg-sprout-light rounded-full flex items-center justify-center">
            <div className="w-8 h-10 bg-sprout-green rounded-t-full"></div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">My Children</h2>
          <p className="text-muted-foreground">Manage missions and transfer funds</p>
        </div>

        {/* Missions Awaiting Approval */}
        {missionsAwaitingApproval.length > 0 && (
          <Card className="bg-yellow-50 border-yellow-200 p-6 mb-6">
            <h3 className="font-bold text-lg mb-2">Missions Awaiting Approval</h3>
            <p className="text-sm text-muted-foreground mb-4">Review and approve missions</p>

            <div className="space-y-4">
              {missionsAwaitingApproval.map((mission) => (
                <Card key={mission.id} className="p-4 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-sprout-light rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-sprout-pink rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{mission.childName}</p>
                      <p className="text-sm text-muted-foreground">Reward: ${mission.reward}</p>
                    </div>
                  </div>
                  <p className="mb-3">{mission.missionName}</p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-sprout-green hover:bg-sprout-dark text-white"
                      onClick={() => handleApprove(mission.id)}
                      disabled={loading}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
                      onClick={() => handleReject(mission.id)}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Children List */}
        <div className="space-y-6">
          {children.map((child) => (
            <Card key={child.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sprout-light rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-sprout-pink rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{child.name}</p>
                    <p className="text-sm text-muted-foreground">Credit Score: {child.creditScore}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${child.balance.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{child.missions.reviewing}</p>
                  <p className="text-sm text-muted-foreground">Reviewing</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{child.missions.done}</p>
                  <p className="text-sm text-muted-foreground">Done</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{child.missions.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold">Pending Missions</h4>
                  <Link href={`/guardian/add-mission?childId=${child.childId}`}>
                    <Button variant="ghost" size="sm" className="text-sprout-green">
                      <Plus className="w-4 h-4 mr-1" />
                      Mission
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {child.pendingMissions.length > 0 ? (
                    child.pendingMissions.map((mission) => (
                      <Card key={mission.id} className="p-3 bg-secondary">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{mission.name}</p>
                            <p className="text-xs text-muted-foreground">Reward: ${mission.reward}</p>
                          </div>
                          <span className="text-xs text-red-600">{mission.deadline}</span>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">No pending missions</p>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {children.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No children added yet</p>
              <Link href="/guardian/add-child">
                <Button className="bg-sprout-green hover:bg-sprout-dark text-white">Add Child</Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Transfer Money Button */}
        {children.length > 0 && (
          <Button
            className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6 mt-6"
            onClick={() => handleTransfer(children[0])}
          >
            Transfer Money
          </Button>
        )}
      </div>

      {/* Piggy Bank Footer */}

    </div>
  )
}
