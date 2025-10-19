import { createServerClient } from "./server"

// Child data queries
export async function getChildData(childId: string) {
  const supabase = await createServerClient()

  const { data: child, error: childError } = await supabase
    .from("children")
    .select(`
      *,
      child_profile:profiles!children_child_id_fkey(full_name, email),
      guardian_profile:profiles!children_guardian_id_fkey(full_name)
    `)
    .eq("child_id", childId)
    .single()

  if (childError) throw childError

  // Get active goal
  const { data: goal } = await supabase.from("goals").select("*").eq("child_id", childId).eq("is_active", true).single()

  // Get mission counts
  const { data: missions } = await supabase.from("missions").select("status").eq("child_id", childId)

  const missionCounts = {
    done: missions?.filter((m) => m.status === "completed").length || 0,
    reviewing: missions?.filter((m) => m.status === "awaiting_approval").length || 0,
    pending: missions?.filter((m) => m.status === "pending").length || 0,
  }

  return {
    child,
    goal,
    missionCounts,
  }
}

export async function getChildMissions(childId: string, status?: string) {
  const supabase = await createServerClient()

  let query = supabase.from("missions").select("*").eq("child_id", childId).order("deadline", { ascending: true })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getShopItems() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("shop_items")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true })

  if (error) throw error
  return data
}

export async function getPurchasedItems(childId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("purchased_items")
    .select(`
      *,
      shop_item:shop_items(*)
    `)
    .eq("child_id", childId)
    .order("purchased_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getGroupSavings(childId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("group_savings_members")
    .select(`
      *,
      group_savings:group_savings(*)
    `)
    .eq("child_id", childId)

  if (error) throw error
  return data
}

// Guardian data queries
export async function getGuardianData(guardianId: string) {
  const supabase = await createServerClient()

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", guardianId)
    .single()

  if (profileError) throw profileError

  return profile
}

export async function getGuardianChildren(guardianId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("children")
    .select(`
      *,
      child_profile:profiles!children_child_id_fkey(full_name, email)
    `)
    .eq("guardian_id", guardianId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data
}

export async function getChildMissionCounts(childId: string) {
  const supabase = await createServerClient()

  const { data: missions } = await supabase.from("missions").select("status").eq("child_id", childId)

  return {
    reviewing: missions?.filter((m) => m.status === "awaiting_approval").length || 0,
    done: missions?.filter((m) => m.status === "completed").length || 0,
    pending: missions?.filter((m) => m.status === "pending").length || 0,
  }
}

export async function getMissionsAwaitingApproval(guardianId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("missions")
    .select(`
      *,
      child_profile:profiles!missions_child_id_fkey(
        full_name,
        email
      )
    `)
    .eq("guardian_id", guardianId)
    .eq("status", "awaiting_approval")
    .order("completed_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCurrentUser() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  const { data: profile, error: perror } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  console.log(profile, perror);

  return { user, profile }
}
