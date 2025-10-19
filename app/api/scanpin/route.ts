import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: Request) {
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
    
    // Get target ID from request body
    const { targetId } = await request.json()
    
    // Upsert an interaction row between the current user and the target
    const { data: existing, error: selectError } = await service
    .from('pins')
    .select('*')
    .or('and(user_id.eq.' + user.id + ',other_user_id.eq.' + targetId + '),and(user_id.eq.' + targetId + ',other_user_id.eq.' + user.id + ')')
    .maybeSingle()
    
    if (selectError) {
        return Response.json({ error: selectError.message }, { status: 500 })
    }
    
    if (existing) {
        // Check if last interaction was too recent
        const now = Math.floor(Date.now() / 1000);
        const timeSinceLastInteraction = now - (existing.last_interaction ?? 0);
        const MIN_INTERACTION_INTERVAL = 28800; // 8 hours
        
        if (timeSinceLastInteraction < MIN_INTERACTION_INTERVAL) {
            return Response.json({ error: 'Interaction too recent' }, { status: 429 });
        }
        
        const { data, error } = await service
        .from('pins')
        .update({
            times_interacted: (existing.times_interacted ?? 0) + 1,
            last_interaction: Math.floor(Date.now() / 1000),
        })
        .eq('id', existing.id)
        .select()
        .single()
        
        if (error) {
            return Response.json({ error: error.message }, { status: 500 })
        }
        
        return Response.json(data)
    } else {
        const { data, error } = await service
        .from('pins')
        .insert({
            user_id: user.id,
            other_user_id: targetId,
            times_interacted: 1,
            last_interaction: Math.floor(Date.now() / 1000),
        })
        .select()
        .single()
        
        if (error) {
            return Response.json({ error: error.message }, { status: 500 })
        }
        
        return Response.json(data)
    }
}