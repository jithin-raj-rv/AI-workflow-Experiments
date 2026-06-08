import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FunctionArgs {
  timerPromptId: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { timerPromptId }: FunctionArgs = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    if (!timerPromptId) {
      return new Response(
        JSON.stringify({ error: 'timerPromptId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_ANON_KEY are required')
    }

    // Internal Supabase client (service role — trusted internal function)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })

    // Create an anonymous Supabase session and obtain an access token for Mastra
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=anonymous`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (!authResponse.ok) {
      const errorBody = await authResponse.text()
      throw new Error(`Supabase anonymous auth failed (${authResponse.status}): ${errorBody}`)
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token || authData.token || ''
    if (!accessToken) {
      throw new Error('Failed to obtain anonymous Supabase access token')
    }

    // Fetch the timer prompt
    const { data: timerPrompt, error: promptError } = await supabase
      .from('timer_prompts')
      .select('*')
      .eq('id', timerPromptId)
      .single()

    if (promptError || !timerPrompt) {
      throw new Error('Failed to fetch timer prompt')
    }

    const userId = timerPrompt.user_id

    // Fetch user's custom system prompt
    const { data: systemPrompts } = await supabase
      .from('system_prompts')
      .select('system_timer_prompt')
      .eq('user_id', userId)
      .limit(1)

    const systemPrompt = (systemPrompts && systemPrompts.length > 0)
      ? systemPrompts[0].system_timer_prompt || ''
      : ''

    // Call Mastra AI server via HTTP
    const mastraUrl = 'https://shy-donkey-76.loca.lt'
    const agentId = 'test-query-agent'

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: timerPrompt.prompt }
    ]

    const mastraResponse = await fetch(`${mastraUrl}/api/agents/${agentId}/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        context: {
          userId,
          timerPromptId,
        }
      })
    })

    if (!mastraResponse.ok) {
      const errorBody = await mastraResponse.text()
      throw new Error(`Mastra server error (${mastraResponse.status}): ${errorBody}`)
    }

    const mastraResult = await mastraResponse.json()
    const responseText = mastraResult.text || mastraResult.response || ''

    if (!responseText) {
      throw new Error('Mastra server returned empty response')
    }

    // Update timer prompt with response
    const { error: updateError } = await supabase
      .from('timer_prompts')
      .update({ response: responseText, sent: true })
      .eq('id', timerPromptId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, response: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})