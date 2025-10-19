import { GuardianDashboardClient } from "./client"
import {
  getGuardianData,
  getGuardianChildren,
  getMissionsAwaitingApproval,
  getChildMissionCounts,
  getCurrentUser,
  getChildMissions,
} from "@/lib/supabase/queries"
import { redirect } from "next/navigation"

export default async function GuardianDashboard() {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.profile?.role !== "guardian") {
    redirect("/login")
  }

  const guardianData = await getGuardianData(currentUser.user.id)
  const children = await getGuardianChildren(currentUser.user.id)
  const missionsAwaitingApproval = await getMissionsAwaitingApproval(currentUser.user.id)

  // Get mission counts for each child
  const childrenWithMissions = await Promise.all(
    children.map(async (child) => {
      const missionCounts = await getChildMissionCounts(child.child_id)
      const pendingMissions = await getChildMissions(child.child_id, "pending")

      return {
        id: child.id,
        childId: child.child_id,
        name: child.child_profile?.full_name || child.child_name,
        balance: Number(child.balance),
        creditScore: child.credit_score,
        missions: missionCounts,
        pendingMissions:
          pendingMissions?.slice(0, 3).map((m) => ({
            id: m.id,
            name: m.name,
            reward: Number(m.reward_amount),
            deadline: new Date(m.deadline).toLocaleDateString(),
          })) || [],
      }
    }),
  )

  const missionsData =
    missionsAwaitingApproval?.map((m) => ({
      id: m.id,
      childId: m.child_id,
      childName: m.child?.child_profile?.full_name || m.child?.child_name || "Child",
      missionName: m.name,
      reward: Number(m.reward_amount),
    })) || []

  return (
    <GuardianDashboardClient
      guardianName={guardianData.full_name?.split(" ")[0] || "Guardian"}
      children={childrenWithMissions}
      missionsAwaitingApproval={missionsData}
    />
  )
}
