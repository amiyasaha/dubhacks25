"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PiggyBank } from "@/components/piggy-bank"
import { Plus } from 'lucide-react'
import { TransferMoneyModal } from "@/components/transfer-money-modal"
import Link from "next/link"

// Mock data - will be replaced with Supabase data
const mockData = {
  guardian: {
    name: "Audrey",
  },
  children: [
    {
      id: 1,
      name: "Noah Vega",
      balance: 15.0,
      creditScore: 12,
      missions: {
        reviewing: 1,
        done: 2,
        pending: 5,
      },
      pendingMissions: [
        { id: 1, name: "Clean your room", reward: 5, deadline: "10/18/2025" },
        { id: 2, name: "Help with dishes", reward: 3, deadline: "10/20/2025" },
      ],
    },
  ],
  missionsAwaitingApproval: [
    {
      id: 1,
      childId: 1,
      childName: "Noah Vega",
      childAvatar: "🐷",
      missionName: "Clean your room",
      reward: 5,
    },
  ],
}

export default function GuardianDashboard() {
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState<(typeof mockData.children)[0] | null>(null)

  const handleApprove = (missionId: number) => {
    // TODO: Implement Supabase mission approval
    console.log("[v0] Approving mission:", missionId)
  }

  const handleReject = (missionId: number) => {
    // TODO: Implement Supabase mission rejection
    console.log("[v0] Rejecting mission:", missionId)
  }

  const handleTransfer = (child: (typeof mockData.children)[0]) => {
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
            <p className="text-2xl font-bold">{mockData.guardian.name}!</p>
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
        {mockData.missionsAwaitingApproval.length > 0 && (
          <Card className="bg-yellow-50 border-yellow-200 p-6 mb-6">
            <h3 className="font-bold text-lg mb-2">Missions Awaiting Approval</h3>
            <p className="text-sm text-muted-foreground mb-4">Review and approve missions</p>

            <div className="space-y-4">
              {mockData.missionsAwaitingApproval.map((mission) => (
                <Card key={mission.id} className="p-4 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-sprout-light rounded-full flex items-center justify-center">
                      <span className="text-xl">{mission.childAvatar}</span>
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
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleReject(mission.id)}
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
          {mockData.children.map((child) => (
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
                  <Link href={`/guardian/add-mission?childId=${child.id}`}>
                    <Button variant="ghost" size="sm" className="text-sprout-green">
                      <Plus className="w-4 h-4 mr-1" />
                      Mission
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {child.pendingMissions.map((mission) => (
                    <Card key={mission.id} className="p-3 bg-secondary">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{mission.name}</p>
                          <p className="text-xs text-muted-foreground">Reward: ${mission.reward}</p>
                        </div>
                        <span className="text-xs text-red-600">{mission.deadline}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Transfer Money Button */}
        <Button
          className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6 mt-6"
          onClick={() => handleTransfer(mockData.children[0])}
        >
          Transfer Money
        </Button>
      </div>

      {/* Piggy Bank Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-sprout-green to-transparent pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <PiggyBank className="w-48" />
        </div>
      </div>

      {/* Transfer Money Modal */}
      <TransferMoneyModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        childName={selectedChild?.name || ""}
      />
    </div>
  )
}
