import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 },
    )
  }

  const service = await createServiceClient()

  const { data } = await service
    .from('pins')
    .select('*')
    .or(`user_id.eq.${user.id},other_user_id.eq.${user.id}`)
    .order('times_interacted', { ascending: false })

  return Response.json(data)
}