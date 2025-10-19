import AddMissionForm from './AddMissionForm'
import { getCurrentUser } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'

interface Props {
  searchParams: { childId?: string }
}

export default async function AddMissionPage({ searchParams }: Props) {
  const childId = searchParams.childId ?? null
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.profile?.role !== 'guardian') {
    redirect('/login')
  }

  return <AddMissionForm childId={childId} guardianId={currentUser.user.id} />
}
