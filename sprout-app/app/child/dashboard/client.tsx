"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { PiggyBank } from "@/components/piggy-bank"
import { CheckSquare, ShoppingCart, Users } from "lucide-react"
import { ContributeModal } from "@/components/contribute-modal"
import { completeMission } from "@/app/actions/missions"
import { purchaseItem } from "@/app/actions/shop"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TransferMoneyModal } from "@/components/transfer-money-modal"

type Tab = "missions" | "shop" | "savings"

interface ChildDashboardClientProps {
  childInfo: {
    name: string
    balance: number
    creditScore: number
    missions: {
      done: number
      reviewing: number
      pending: number
    }
    goal: {
      name: string
      target: number
      current: number
    } | null
  }
  shopData: {
    bought: Array<{ id: string; name: string; price: number; image: string | null }>
    browse: Array<{ id: string; name: string; price: number; image: string | null; description: string | null }>
  }
  groupSavingsData: Array<{
    id: string
    name: string
    target: number
    current: number
    contributed: number
  }>
  missionsData: {
    pending: Array<{ id: string; name: string; reward: number; deadline: string }>
    awaitingApproval: Array<{ id: string; name: string; reward: number; deadline: string }>
  }
  childId: string
}

export function ChildDashboardClient({
  childInfo,
  shopData,
  groupSavingsData,
  missionsData,
  childId,
}: ChildDashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("missions")
  const [contributeModalOpen, setContributeModalOpen] = useState(false)
  const [selectedSavingsGoal, setSelectedSavingsGoal] = useState<(typeof groupSavingsData)[0] | null>(null)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState("Sprout")
  const [loading, setLoading] = useState(false)

  const getCreditScoreLabel = (score: number) => {
    if (score >= 76) return { label: "Excellent: 76 -100", color: "text-sprout-green" }
    if (score >= 51) return { label: "Good: 51 - 75", color: "text-yellow-600" }
    if (score >= 26) return { label: "Fair: 26 - 50", color: "text-orange-600" }
    return { label: "Needs Improvement: 0 - 25", color: "text-red-600" }
  }

  const creditScoreInfo = getCreditScoreLabel(childInfo.creditScore)
  const goalProgress = childInfo.goal ? (childInfo.goal.current / childInfo.goal.target) * 100 : 0

  const handleContribute = (goal: (typeof groupSavingsData)[0]) => {
    setSelectedSavingsGoal(goal)
    setContributeModalOpen(true)
  }

  const handleCompleteMission = async (missionId: string) => {
    setLoading(true)
    const result = await completeMission(missionId)
    setLoading(false)

    if (result.success) {
      toast.success("Mission submitted for approval!")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to complete mission")
    }
  }

  const handlePurchase = async (itemId: string, price: number) => {
    setLoading(true)
    const result = await purchaseItem(childId, itemId, price)
    setLoading(false)

    if (result.success) {
      toast.success("Item purchased!")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to purchase item")
    }
  }

  const handleTransfer = (child: "Sprout") => {
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
            <p className="text-2xl font-bold">{childInfo.name}!</p>
          </div>
          <div className="w-16 h-16 bg-sprout-light rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-sprout-pink rounded-full"></div>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-sprout-green to-sprout-dark text-white p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/90 mb-2">Your Balance</p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">${childInfo.balance.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-right text-sm">
              <p>
                <span className="font-bold">{childInfo.missions.done}</span> Done
              </p>
              <p>
                <span className="font-bold">{childInfo.missions.reviewing}</span> Reviewing
              </p>
              <p>
                <span className="font-bold">{childInfo.missions.pending}</span> Pending
              </p>
            </div>
          </div>
        </Card>

        {/* Credit Score */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
                <span className="text-3xl font-bold">{childInfo.creditScore}</span>
              </div>
              <div
                className="absolute bottom-0 left-0 w-16 h-8 bg-red-500 rounded-bl-full"
                style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
              ></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Credit Score</h3>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Excellent: 76 -100</p>
                <p className="text-muted-foreground">Good: 51 - 75</p>
                <p className="text-muted-foreground">Fair: 26 - 50</p>
                <p className={`font-semibold ${creditScoreInfo.color} bg-red-100 px-2 py-1 rounded inline-block`}>
                  {creditScoreInfo.label}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Goal Card */}
        {childInfo.goal && (
          <Card className="p-6 mb-6 border-2 border-sprout-green">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sprout-green font-semibold mb-1">Goal:</p>
                <p className="font-bold text-lg">{childInfo.goal.name}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">${childInfo.goal.target.toFixed(2)}</span>
              </div>
            </div>
            <Progress value={goalProgress} className="h-3" />
          </Card>
        )}
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <Card className="p-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={activeTab === "missions" ? "default" : "ghost"}
              className={
                activeTab === "missions"
                  ? "bg-sprout-light text-sprout-green hover:bg-sprout-light"
                  : "hover:bg-sprout-light/50"
              }
              onClick={() => setActiveTab("missions")}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Missions
            </Button>
            <Button
              variant={activeTab === "shop" ? "default" : "ghost"}
              className={
                activeTab === "shop"
                  ? "bg-sprout-light text-sprout-green hover:bg-sprout-light"
                  : "hover:bg-sprout-light/50"
              }
              onClick={() => setActiveTab("shop")}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop
            </Button>
            <Button
              variant={activeTab === "savings" ? "default" : "ghost"}
              className={
                activeTab === "savings"
                  ? "bg-sprout-light text-sprout-green hover:bg-sprout-light"
                  : "hover:bg-sprout-light/50"
              }
              onClick={() => setActiveTab("savings")}
            >
              <Users className="w-4 h-4 mr-2" />
              Group Savings
            </Button>
          </div>
        </Card>
      </div>

      {/* Tab Content */}
      <div className="px-6">
        {activeTab === "missions" && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Missions</h2>

            {/* Pending Missions */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                Pending Missions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>
              <div className="space-y-3">
                {missionsData.pending.map((mission) => (
                  <Card key={mission.id} className="p-4 bg-secondary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          disabled={loading}
                          onCheckedChange={(checked) => {
                            if (checked) handleCompleteMission(mission.id)
                          }}
                        />
                        <div>
                          <p className="font-medium">{mission.name}</p>
                          <p className="text-sm text-muted-foreground">Reward: ${mission.reward}</p>
                        </div>
                      </div>
                      <span className="text-sm text-red-600">{mission.deadline}</span>
                    </div>
                  </Card>
                ))}
                {missionsData.pending.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No pending missions</p>
                )}
              </div>
            </div>

            {/* Awaiting Approval */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                Awaiting Approval
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>
              <div className="space-y-3">
                {missionsData.awaitingApproval.map((mission) => (
                  <Card key={mission.id} className="p-4 bg-secondary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox checked disabled />
                        <div>
                          <p className="font-medium">{mission.name}</p>
                          <p className="text-sm text-muted-foreground">Reward: ${mission.reward}</p>
                        </div>
                      </div>
                      <span className="text-sm text-red-600">{mission.deadline}</span>
                    </div>
                  </Card>
                ))}
                {missionsData.awaitingApproval.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No missions awaiting approval</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {activeTab === "shop" && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Shop</h2>

            {/* Bought Section */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                Bought
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>
              <div className="space-y-4">
                {shopData.bought.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sprout-green font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {shopData.bought.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No items purchased yet</p>
                )}
              </div>
            </div>

            {/* Browse Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                Browse
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>
              <div className="space-y-4">
                {shopData.browse.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sprout-green font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                    <Button
                      className="bg-sprout-green hover:bg-sprout-dark text-white"
                      onClick={() => handlePurchase(item.id, item.price)}
                      disabled={loading || childInfo.balance < item.price}
                    >
                      Buy
                    </Button>
                  </div>
                ))}
                {shopData.browse.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No items available</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {activeTab === "savings" && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Group Savings</h2>

            <div className="space-y-6">
              {groupSavingsData.map((goal) => {
                const progress = (goal.current / goal.target) * 100
                return (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{goal.name}</h3>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          ${goal.current.toFixed(2)} of {goal.target.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">You contributed: ${goal.contributed.toFixed(2)}</p>
                      </div>
                      <Button
                        className="bg-sprout-green hover:bg-sprout-dark text-white"
                        onClick={() => handleContribute(goal)}
                      >
                        Contribute
                      </Button>
                    </div>
                  </div>
                )
              })}
              {groupSavingsData.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No group savings goals yet</p>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Piggy Bank Footer */}
      <Button
          className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6 mt-6"
          onClick={() => handleTransfer("Sprout")}
      >
          Transfer Money
      </Button>
      <TransferMoneyModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        childName={selectedChild}
      />
      {/* Contribute Modal */}
      <ContributeModal
        open={contributeModalOpen}
        onOpenChange={setContributeModalOpen}
        goalName={selectedSavingsGoal?.name || ""}
        goalId={selectedSavingsGoal?.id || ""}
        childId={childId}
      />
    </div>
  )
}
