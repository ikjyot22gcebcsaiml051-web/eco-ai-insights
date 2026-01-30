import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are an AI sustainability analysis engine.
Analyze the provided AI chat transcript.
Estimate total tokens used, task category distribution,
energy consumption in kWh, and CO₂ emissions in grams.
Base estimations on typical LLM token-to-energy scaling.

You MUST return a valid JSON object with this exact structure:
{
  "total_tokens": <number>,
  "estimated_energy_kwh": <number>,
  "estimated_co2_grams": <number>,
  "task_breakdown": {
    "coding": <number between 0-100>,
    "reasoning": <number between 0-100>,
    "math": <number between 0-100>,
    "general": <number between 0-100>
  }
}

The task_breakdown percentages should sum to 100.
Return ONLY the JSON object, no additional text or markdown.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Processing chat analysis request');

    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Transcript text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Carbon analysis engine not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate baseline metrics using the specified formula
    const textLength = transcript.length;
    const estimatedTokens = Math.ceil(textLength / 4);
    const estimatedEnergyKwh = estimatedTokens * 0.0000025;
    const estimatedCo2Grams = estimatedEnergyKwh * 450; // average grid intensity

    console.log(`Transcript length: ${textLength}, Estimated tokens: ${estimatedTokens}`);

    // Call Lovable AI for semantic analysis
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyze this chat transcript:\n\n${transcript.substring(0, 10000)}` } // Limit to 10k chars
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      // Return fallback calculations if AI fails
      return new Response(
        JSON.stringify({
          total_tokens: estimatedTokens,
          estimated_energy_kwh: Number(estimatedEnergyKwh.toFixed(6)),
          estimated_co2_grams: Number(estimatedCo2Grams.toFixed(2)),
          task_breakdown: {
            coding: 20,
            reasoning: 20,
            math: 10,
            general: 50
          },
          fallback: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({
          total_tokens: estimatedTokens,
          estimated_energy_kwh: Number(estimatedEnergyKwh.toFixed(6)),
          estimated_co2_grams: Number(estimatedCo2Grams.toFixed(2)),
          task_breakdown: {
            coding: 20,
            reasoning: 20,
            math: 10,
            general: 50
          },
          fallback: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI response content:', content);

    // Parse the JSON response
    let analysisResult;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return fallback with our calculated values
      return new Response(
        JSON.stringify({
          total_tokens: estimatedTokens,
          estimated_energy_kwh: Number(estimatedEnergyKwh.toFixed(6)),
          estimated_co2_grams: Number(estimatedCo2Grams.toFixed(2)),
          task_breakdown: {
            coding: 20,
            reasoning: 20,
            math: 10,
            general: 50
          },
          fallback: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Merge AI analysis with our calculations (use our formula for energy/CO2)
    const result = {
      total_tokens: analysisResult.total_tokens || estimatedTokens,
      estimated_energy_kwh: Number(estimatedEnergyKwh.toFixed(6)),
      estimated_co2_grams: Number(estimatedCo2Grams.toFixed(2)),
      task_breakdown: analysisResult.task_breakdown || {
        coding: 20,
        reasoning: 20,
        math: 10,
        general: 50
      }
    };

    console.log('Analysis result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-chat:', error);
    return new Response(
      JSON.stringify({ error: 'Carbon analysis engine temporarily unavailable.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
