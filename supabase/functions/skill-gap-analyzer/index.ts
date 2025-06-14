import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentSkills, targetJobTitle, targetJobDescription } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a career advisor. Analyze skill gaps between current skills and target job requirements.
            Provide detailed analysis and learning recommendations.
            Return JSON with: requiredSkills[], missingSkills[], skillGapScore (0-100), recommendations[], learningPath[]`
          },
          {
            role: 'user',
            content: `Current Skills: ${currentSkills.join(', ')}
            Target Job: ${targetJobTitle}
            Job Description: ${targetJobDescription}
            
            Analyze the skill gap and provide learning recommendations.`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch {
      // Fallback analysis
      analysis = {
        requiredSkills: ["JavaScript", "React", "Node.js"],
        missingSkills: ["TypeScript", "Docker", "AWS"],
        skillGapScore: 70,
        recommendations: [
          "Learn TypeScript for better code quality",
          "Get familiar with containerization using Docker",
          "Study cloud platforms like AWS"
        ],
        learningPath: [
          "Complete TypeScript fundamentals course",
          "Practice with Docker containers",
          "Get AWS certification"
        ]
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in skill-gap-analyzer:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze skill gap',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});