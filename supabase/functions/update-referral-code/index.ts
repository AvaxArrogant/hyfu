import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface UpdateReferralCodeRequest {
  userId: string
  customCode: string
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

    const { userId, customCode }: UpdateReferralCodeRequest = await req.json()

    // Validate custom code (alphanumeric, 3-20 characters)
    if (!customCode || !/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
      return new Response(
        JSON.stringify({ error: 'Custom code must be 3-20 alphanumeric characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if code is already taken
    const { data: existingCode } = await supabase
      .from('users')
      .select('id')
      .or(`referral_code.eq.${customCode.toUpperCase()},custom_referral_code.eq.${customCode.toUpperCase()}`)
      .single()

    if (existingCode) {
      return new Response(
        JSON.stringify({ error: 'Referral code already taken' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update user's custom referral code
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ custom_referral_code: customCode.toUpperCase() })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        customReferralCode: updatedUser.custom_referral_code
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Update referral code error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})