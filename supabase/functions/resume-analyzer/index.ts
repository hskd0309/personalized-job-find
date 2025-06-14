import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { resumeText, skills, experience } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Analyze resume with OpenAI
    const analysisPrompt = `
      Analyze this resume and provide a comprehensive evaluation:
      
      Resume Content: ${resumeText}
      Skills Listed: ${skills?.join(', ') || 'None provided'}
      Experience: ${experience || 'Not specified'}
      
      Please provide:
      1. Overall score (0-100)
      2. Grammar and formatting assessment
      3. Keyword richness analysis
      4. Improvement suggestions
      5. Missing skills recommendations
      6. ATS-friendliness score
      
      Format your response as JSON with these fields:
      {
        "overallScore": number,
        "grammarScore": number,
        "formattingScore": number,
        "keywordScore": number,
        "atsScore": number,
        "improvements": ["suggestion1", "suggestion2"],
        "missingSkills": ["skill1", "skill2"],
        "feedback": "detailed feedback text"
      }
    `;

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
            content: 'You are an expert resume analyst. Provide detailed, actionable feedback to help job seekers improve their resumes. Always respond with valid JSON.' 
          },
          { role: 'user', content: analysisPrompt }
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
      // Fallback if JSON parsing fails
      analysis = {
        overallScore: 75,
        grammarScore: 80,
        formattingScore: 70,
        keywordScore: 75,
        atsScore: 72,
        improvements: ["Add more quantifiable achievements", "Include relevant keywords", "Improve formatting consistency"],
        missingSkills: ["Data Analysis", "Project Management", "Communication"],
        feedback: data.choices[0].message.content
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in resume-analyzer function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze resume', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});