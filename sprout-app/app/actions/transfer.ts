"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function transferMoney(childId: string, amount: number) {
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

  // Add to balance
  const newBalance = Number(child.balance) + amount
  const { error: balanceError } = await supabase
    .from("children")
    .update({ balance: newBalance })
    .eq("child_id", childId)

  if (balanceError) {
    return { success: false, error: balanceError.message }
  }

  // Create transaction record
  await supabase.from("transactions").insert({
    child_id: childId,
    type: "transfer",
    amount: amount,
    description: "Money transfer from guardian",
  })

  revalidatePath("/guardian/dashboard")
  revalidatePath("/child/dashboard")
  return { success: true }
}
