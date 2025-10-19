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
  console.log(user.id)
  const service = await createServiceClient()

  const { data } = await service
    .from('pins')
    .select('*')
    .eq('user_id', user.id)
  return Response.json(data)
}