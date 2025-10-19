"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { PiggyBank } from "@/components/piggy-bank"
import { CheckSquare, ShoppingCart, Users } from "lucide-react"
import { ContributeModal } from "@/components/contribute-modal"

// Mock data - will be replaced with Supabase data
const mockData = {
  child: {
    name: "Noah",
    balance: 15.0,
    creditScore: 12,
    missions: {
      done: 2,
      reviewing: 1,
      pending: 5,
    },
    goal: {
      name: "Tennis racket",
      target: 89.0,
      current: 15.0,
    },
  },
  pendingMissions: [
    { id: 1, name: "Do laundry", reward: 5, deadline: "10/18/2025", completed: false },
    { id: 2, name: "Help with dishes", reward: 3, deadline: "10/20/2025", completed: false },
  ],
  awaitingApproval: [{ id: 3, name: "Clean your room", reward: 5, deadline: "10/18/2025", completed: true }],
}

const mockShopItems = {
  bought: [{ id: 1, name: "Lollipop", price: 2.0, image: "/lollipop.jpg" }],
  browse: [
    { id: 2, name: "Wallet", price: 8.0, image: "/leather-wallet-contents.png" },
    { id: 3, name: "Bag", price: 20.0, image: "/colorful-backpack-on-wooden-table.png" },
  ],
}

const mockGroupSavings = [
  { id: 1, name: "Pizza Party Fund", target: 100.0, current: 52.0, members: 3 },
  { id: 2, name: "Classroom Party", target: 100.0, current: 67.0, members: 3 },
  { id: 3, name: "Ice cream Party", target: 100.0, current: 38.0, members: 3 },
]

type Tab = "missions" | "shop" | "savings"

export default function ChildDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("missions")
  const [contributeModalOpen, setContributeModalOpen] = useState(false)
  const [selectedSavingsGoal, setSelectedSavingsGoal] = useState<(typeof mockGroupSavings)[0] | null>(null)

  const getCreditScoreLabel = (score: number) => {
    if (score >= 76) return { label: "Excellent: 76 -100", color: "text-sprout-green" }
    if (score >= 51) return { label: "Good: 51 - 75", color: "text-yellow-600" }
    if (score >= 26) return { label: "Fair: 26 - 50", color: "text-orange-600" }
    return { label: "Needs Improvement: 0 - 25", color: "text-red-600" }
  }

  const creditScoreInfo = getCreditScoreLabel(mockData.child.creditScore)
  const goalProgress = (mockData.child.goal.current / mockData.child.goal.target) * 100

  const handleContribute = (goal: (typeof mockGroupSavings)[0]) => {
    setSelectedSavingsGoal(goal)
    setContributeModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-2xl font-bold">{mockData.child.name}!</p>
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
                <span className="text-4xl font-bold">${mockData.child.balance.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-right text-sm">
              <p>
                <span className="font-bold">{mockData.child.missions.done}</span> Done
              </p>
              <p>
                <span className="font-bold">{mockData.child.missions.reviewing}</span> Reviewing
              </p>
              <p>
                <span className="font-bold">{mockData.child.missions.pending}</span> Pending
              </p>
            </div>
          </div>
        </Card>

        {/* Credit Score */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
                <span className="text-3xl font-bold">{mockData.child.creditScore}</span>
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
        <Card className="p-6 mb-6 border-2 border-sprout-green">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sprout-green font-semibold mb-1">Goal:</p>
              <p className="font-bold text-lg">{mockData.child.goal.name}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">${mockData.child.goal.target.toFixed(2)}</span>
            </div>
          </div>
          <Progress value={goalProgress} className="h-3" />
        </Card>
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
                {mockData.pendingMissions.map((mission) => (
                  <Card key={mission.id} className="p-4 bg-secondary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox />
                        <div>
                          <p className="font-medium">{mission.name}</p>
                          <p className="text-sm text-muted-foreground">Reward: ${mission.reward}</p>
                        </div>
                      </div>
                      <span className="text-sm text-red-600">{mission.deadline}</span>
                    </div>
                  </Card>
                ))}
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
                {mockData.awaitingApproval.map((mission) => (
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
                {mockShopItems.bought.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-secondary rounded-lg"></div>
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sprout-green font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
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
                {mockShopItems.browse.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-secondary rounded-lg"></div>
                    <div className="flex-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sprout-green font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                    <Button className="bg-sprout-green hover:bg-sprout-dark text-white">Buy</Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === "savings" && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Group Savings</h2>

            <div className="space-y-6">
              {mockGroupSavings.map((goal) => {
                const progress = (goal.current / goal.target) * 100
                return (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{goal.name}</h3>
                      <span className="text-sm text-muted-foreground">{goal.members} Members</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        ${goal.current.toFixed(2)} of {goal.target.toFixed(2)}
                      </p>
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
            </div>
          </Card>
        )}
      </div>

      {/* Piggy Bank Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-sprout-green to-transparent pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <PiggyBank className="w-48" />
        </div>
      </div>

      {/* Contribute Modal */}
      <ContributeModal
        open={contributeModalOpen}
        onOpenChange={setContributeModalOpen}
        goalName={selectedSavingsGoal?.name || ""}
      />
    </div>
  )
}
