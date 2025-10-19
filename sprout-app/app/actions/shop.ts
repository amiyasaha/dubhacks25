"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function purchaseItem(childId: string, shopItemId: string, price: number) {
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

  if (Number(child.balance) < price) {
    return { success: false, error: "Insufficient balance" }
  }

  // Deduct from balance
  const newBalance = Number(child.balance) - price
  const { error: balanceError } = await supabase
    .from("children")
    .update({ balance: newBalance })
    .eq("child_id", childId)

  if (balanceError) {
    return { success: false, error: balanceError.message }
  }

  // Record purchase
  const { error: purchaseError } = await supabase.from("purchased_items").insert({
    child_id: childId,
    shop_item_id: shopItemId,
  })

  if (purchaseError) {
    return { success: false, error: purchaseError.message }
  }

  // Create transaction record
  await supabase.from("transactions").insert({
    child_id: childId,
    type: "purchase",
    amount: -price,
    description: "Shop purchase",
  })

  revalidatePath("/child/dashboard")
  return { success: true }
}
