import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

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

  const { data } = await supabase
    .from('pins')
    .select('pins')
    .eq('user_id', user.id)
    .single()

  return Response.json(data)
}