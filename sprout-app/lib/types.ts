// Type definitions for the Sprout app

export type UserRole = "guardian" | "child"

export interface User {
  id: string
  username: string
  role: UserRole
  createdAt: Date
}

export interface Guardian extends User {
  role: "guardian"
  children: Child[]
}

export interface Child extends User {
  role: "child"
  guardianId: string
  name: string
  balance: number
  creditScore: number
}

export interface Mission {
  id: string
  childId: string
  name: string
  description?: string
  reward: number
  deadline: Date
  status: "pending" | "completed" | "approved" | "rejected"
  createdAt: Date
  completedAt?: Date
  approvedAt?: Date
}

export interface Goal {
  id: string
  childId: string
  name: string
  targetAmount: number
  currentAmount: number
  createdAt: Date
}

export interface ShopItem {
  id: string
  name: string
  price: number
  imageUrl?: string
  createdAt: Date
}

export interface Purchase {
  id: string
  childId: string
  itemId: string
  price: number
  purchasedAt: Date
}

export interface GroupSavings {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  memberIds: string[]
  createdAt: Date
}

export interface Contribution {
  id: string
  groupSavingsId: string
  childId: string
  amount: number
  contributedAt: Date
}

export interface Transaction {
  id: string
  fromId?: string // guardian or null for system
  toId: string // child
  amount: number
  type: "transfer" | "mission_reward" | "purchase" | "contribution"
  description?: string
  createdAt: Date
}
