"use server"

import { createClient } from "@/lib/supabase/server"

export interface ChildData {
  name: string
  username: string
  password: string
}

export async function createChildAccounts(children: ChildData[]) {
  const supabase = await createClient()

  // Get the current guardian user
  const {
    data: { user: guardian },
    error: guardianError,
  } = await supabase.auth.getUser()

  console.log(guardian);

  if (guardianError || !guardian) {
    return { success: false, error: "Guardian not authenticated" }
  }

  const results = []

  for (const child of children) {
    try {
      // Create child auth account using admin API
      // Note: In production, you'd use the service role key for this
      // For now, we'll create a regular user account
      const email = `${child.username}@mlsdk12.org` // Generate email from username

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: child.password,
        options: {
          data: {
            role: "child",
            username: child.username,
            full_name: child.name,
          },
        },
      })

      if (authError) {
        results.push({ name: child.name, success: false, error: authError.message })
        continue
      }

      if (!authData.user) {
        results.push({ name: child.name, success: false, error: "Failed to create user" })
        continue
      }

      // Create children table entry linking to guardian
      const { error: childError } = await supabase.from("children").insert({
        child_id: authData.user.id,
        guardian_id: guardian.id,
        child_name: child.name,
        balance: 0,
        credit_score: 50, // Starting credit score
      })

      if (childError) {
        results.push({ name: child.name, success: false, error: childError.message })
        continue
      }

      results.push({ name: child.name, success: true, username: child.username })
    } catch (error) {
      results.push({
        name: child.name,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const allSuccessful = results.every((r) => r.success)
  return {
    success: allSuccessful,
    results,
    message: allSuccessful ? "All children created successfully" : "Some children failed to create",
  }
}
