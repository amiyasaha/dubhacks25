import { ChildDashboardClient } from "./client"
import {
  getChildData,
  getChildMissions,
  getShopItems,
  getPurchasedItems,
  getGroupSavings,
  getCurrentUser,
} from "@/lib/supabase/queries"
import { redirect } from "next/navigation"

type Tab = "missions" | "shop" | "savings"

export default async function ChildDashboard() {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.profile?.role !== "child") {
    redirect("/login")
  }

  const childData = await getChildData(currentUser.user.id)
  const pendingMissions = await getChildMissions(currentUser.user.id, "pending")
  const awaitingApprovalMissions = await getChildMissions(currentUser.user.id, "awaiting_approval")
  const shopItems = await getShopItems()
  const purchasedItems = await getPurchasedItems(currentUser.user.id)
  const groupSavings = await getGroupSavings(currentUser.user.id)

  const childInfo = {
    name: childData.child.child_profile?.full_name?.split(" ")[0] || "Child",
    balance: Number(childData.child.balance),
    creditScore: childData.child.credit_score,
    missions: childData.missionCounts,
    goal: childData.goal
      ? {
          name: childData.goal.name,
          target: Number(childData.goal.target_amount),
          current: Number(childData.goal.current_amount),
        }
      : null,
  }

  const shopData = {
    bought:
      purchasedItems?.map((item) => ({
        id: item.shop_item.id,
        name: item.shop_item.name,
        price: Number(item.shop_item.price),
        image: item.shop_item.image_url,
      })) || [],
    browse:
      shopItems
        ?.filter((item) => !purchasedItems?.some((p) => p.shop_item_id === item.id))
        .map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.image_url,
          description: item.description,
        })) || [],
  }

  const groupSavingsData =
    groupSavings?.map((gs) => ({
      id: gs.group_savings.id,
      name: gs.group_savings.name,
      target: Number(gs.group_savings.target_amount),
      current: Number(gs.group_savings.current_amount),
      contributed: Number(gs.contributed_amount),
    })) || []

  const missionsData = {
    pending:
      pendingMissions?.map((m) => ({
        id: m.id,
        name: m.name,
        reward: Number(m.reward_amount),
        deadline: new Date(m.deadline).toLocaleDateString(),
      })) || [],
    awaitingApproval:
      awaitingApprovalMissions?.map((m) => ({
        id: m.id,
        name: m.name,
        reward: Number(m.reward_amount),
        deadline: new Date(m.deadline).toLocaleDateString(),
      })) || [],
  }

  return (
    <ChildDashboardClient
      childInfo={childInfo}
      shopData={shopData}
      groupSavingsData={groupSavingsData}
      missionsData={missionsData}
      childId={currentUser.user.id}
    />
  )
}
