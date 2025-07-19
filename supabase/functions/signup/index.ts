import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SignupRequest {
  email: string
  referredByCode?: string
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

    const { email, referredByCode }: SignupRequest = await req.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate unique referral code
    const { data: codeResult } = await supabase.rpc('generate_referral_code')
    const referralCode = codeResult

    // Validate referrer if provided
    let referrerId = null
    if (referredByCode) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id')
        .or(`referral_code.eq.${referredByCode},custom_referral_code.eq.${referredByCode}`)
        .single()

      if (referrer) {
        referrerId = referrer.id
      }
    }

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        referral_code: referralCode,
        referred_by: referredByCode || null
      })
      .select()
      .single()

    if (userError) {
      throw userError
    }

    // Create referral record if referred
    if (referrerId) {
      await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerId,
          referee_email: email,
          referee_id: newUser.id,
          status: 'completed'
        })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: newUser,
        message: 'Successfully signed up!' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})