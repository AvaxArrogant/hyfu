import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get total signups
    const { count: totalSignups } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get total referrals
    const { count: totalReferrals } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })

    // Get completed referrals
    const { count: completedReferrals } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // Calculate conversion rate
    const conversionRate = totalReferrals > 0 
      ? ((completedReferrals || 0) / totalReferrals * 100).toFixed(2)
      : '0.00'

    // Get top referrers
    const { data: topReferrers } = await supabase
      .from('users')
      .select(`
        id,
        wallet_address,
        hype_domain,
        custom_referral_code,
        referral_code,
        referrals!referrer_id(count)
      `)
      .not('wallet_address', 'is', null)
      .order('referrals(count)', { ascending: false })
      .limit(10)

    const formattedReferrers = topReferrers?.map((user, index) => ({
      rank: index + 1,
      address: user.hype_domain || user.wallet_address,
      invites: user.referrals?.[0]?.count || 0,
      signups: user.referrals?.[0]?.count || 0 // For now, same as invites
    })) || []

    return new Response(
      JSON.stringify({
        totalSignups: totalSignups || 0,
        totalInvites: totalReferrals || 0,
        conversionRate: `${conversionRate}%`,
        topReferrers: formattedReferrers
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin stats error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})