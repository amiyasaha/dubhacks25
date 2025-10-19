"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function completeMission(missionId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("missions")
    .update({
      status: "awaiting_approval",
      completed_at: new Date().toISOString(),
    })
    .eq("id", missionId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/child/dashboard")
  return { success: true }
}

export async function approveMission(missionId: string) {
  const supabase = await createServerClient()

  // Get mission details
  const { data: mission, error: missionError } = await supabase
    .from("missions")
    .select("*, children(*)")
    .eq("id", missionId)
    .single()

  if (missionError) {
    return { success: false, error: missionError.message }
  }

  // Update mission status
  const { error: updateError } = await supabase
    .from("missions")
    .update({
      status: "completed",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", missionId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  // Update child balance
  const newBalance = Number(mission.children.balance) + Number(mission.reward_amount)
  const { error: balanceError } = await supabase
    .from("children")
    .update({ balance: newBalance })
    .eq("id", mission.child_id)

  if (balanceError) {
    return { success: false, error: balanceError.message }
  }

  // Create transaction record
  await supabase.from("transactions").insert({
    child_id: mission.child_id,
    type: "mission_reward",
    amount: mission.reward_amount,
    description: `Reward for: ${mission.name}`,
  })

  revalidatePath("/guardian/dashboard")
  revalidatePath("/child/dashboard")
  return { success: true }
}

export async function rejectMission(missionId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("missions")
    .update({
      status: "pending",
      completed_at: null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", missionId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/guardian/dashboard")
  revalidatePath("/child/dashboard")
  return { success: true }
}

export async function createMission(formData: {
  childId: string
  guardianId: string
  name: string
  description: string
  deadline: string
  rewardAmount: number
}) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("missions").insert({
    child_id: formData.childId,
    guardian_id: formData.guardianId,
    name: formData.name,
    description: formData.description,
    deadline: formData.deadline,
    reward_amount: formData.rewardAmount,
    status: "pending",
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/guardian/dashboard")
  revalidatePath("/child/dashboard")
  return { success: true }
}
