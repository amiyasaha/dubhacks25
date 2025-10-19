// Mock data for development - will be replaced with Supabase queries

import type { Child, Mission, ShopItem, GroupSavings } from "./types"

export const mockChildren: Child[] = [
  {
    id: "1",
    username: "noah",
    role: "child",
    guardianId: "guardian-1",
    name: "Noah Vega",
    balance: 15.0,
    creditScore: 12,
    createdAt: new Date(),
  },
]

export const mockMissions: Mission[] = [
  {
    id: "1",
    childId: "1",
    name: "Do laundry",
    reward: 5,
    deadline: new Date("2025-10-18"),
    status: "pending",
    createdAt: new Date(),
  },
  {
    id: "2",
    childId: "1",
    name: "Help with dishes",
    reward: 3,
    deadline: new Date("2025-10-20"),
    status: "pending",
    createdAt: new Date(),
  },
  {
    id: "3",
    childId: "1",
    name: "Clean your room",
    reward: 5,
    deadline: new Date("2025-10-18"),
    status: "completed",
    createdAt: new Date(),
    completedAt: new Date(),
  },
]

export const mockShopItems: ShopItem[] = [
  {
    id: "1",
    name: "Lollipop",
    price: 2.0,
    imageUrl: "/lollipop.jpg",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Wallet",
    price: 8.0,
    imageUrl: "/leather-wallet-contents.png",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Bag",
    price: 20.0,
    imageUrl: "/colorful-backpack-on-wooden-table.png",
    createdAt: new Date(),
  },
]

export const mockGroupSavings: GroupSavings[] = [
  {
    id: "1",
    name: "Pizza Party Fund",
    targetAmount: 100.0,
    currentAmount: 52.0,
    memberIds: ["1", "2", "3"],
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Classroom Party",
    targetAmount: 100.0,
    currentAmount: 67.0,
    memberIds: ["1", "2", "3"],
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Ice cream Party",
    targetAmount: 100.0,
    currentAmount: 38.0,
    memberIds: ["1", "2", "3"],
    createdAt: new Date(),
  },
]
