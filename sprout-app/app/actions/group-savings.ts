"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function contributeToGroupSavings(childId: string, groupSavingsId: string, amount: number) {
  const supabase = await createServerClient()

  // Get current balance
  const { data: child, error: childError } = await supabase
    .from("children")
    .select("balance")
    .eq("child_id", childId)
    .single()

  if (childError) {
    return { success: false, error: childError.message }
  }

  if (Number(child.balance) < amount) {
    return { success: false, error: "Insufficient balance" }
  }

  // Deduct from balance
  const newBalance = Number(child.balance) - amount
  const { error: balanceError } = await supabase
    .from("children")
    .update({ balance: newBalance })
    .eq("child_id", childId)

  if (balanceError) {
    return { success: false, error: balanceError.message }
  }

  // Update group savings member contribution
  const { data: member } = await supabase
    .from("group_savings_members")
    .select("contributed_amount")
    .eq("child_id", childId)
    .eq("group_savings_id", groupSavingsId)
    .single()

  const newContribution = Number(member?.contributed_amount || 0) + amount

  const { error: memberError } = await supabase.from("group_savings_members").upsert({
    child_id: childId,
    group_savings_id: groupSavingsId,
    contributed_amount: newContribution,
  })

  if (memberError) {
    return { success: false, error: memberError.message }
  }

  // Update group savings total
  const { data: groupSavings } = await supabase
    .from("group_savings")
    .select("current_amount")
    .eq("id", groupSavingsId)
    .single()

  const newTotal = Number(groupSavings?.current_amount || 0) + amount

  await supabase.from("group_savings").update({ current_amount: newTotal }).eq("id", groupSavingsId)

  // Create transaction record
  await supabase.from("transactions").insert({
    child_id: childId,
    type: "group_savings",
    amount: -amount,
    description: "Group savings contribution",
  })

  revalidatePath("/child/dashboard")
  return { success: true }
}
