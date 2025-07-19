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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get leaderboard data with referral counts
    const { data: leaderboard, error } = await supabase
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
      .limit(50)

    if (error) {
      throw error
    }

    // Format leaderboard data and sort by invite count
    const formattedLeaderboard = leaderboard?.map((user) => ({
      address: user.hype_domain || user.wallet_address,
      displayAddress: user.hype_domain || 
        `${user.wallet_address?.slice(0, 6)}...${user.wallet_address?.slice(-4)}`,
      invites: user.referrals?.[0]?.count || 0,
      isHypeDomain: !!user.hype_domain
    }))
      .sort((a, b) => b.invites - a.invites)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      })) || []

    return new Response(
      JSON.stringify({ leaderboard: formattedLeaderboard }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Leaderboard error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})