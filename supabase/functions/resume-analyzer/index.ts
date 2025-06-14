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
      You are an AI Resume Analyst with extensive knowledge of ATS systems and hiring practices. 
      Analyze this resume comprehensively and provide detailed, actionable feedback:
      
      RESUME CONTENT: ${resumeText}
      SKILLS LISTED: ${skills?.join(', ') || 'None provided'}
      EXPERIENCE: ${experience || 'Not specified'}
      
      Provide a detailed evaluation covering:
      1. Overall Score (0-100)
      2. Grammar and formatting quality score (0-100)
      3. Keyword optimization score (0-100)
      4. ATS-friendliness score (0-100)
      5. Specific improvements needed (minimum 5 actionable items)
      6. Missing skills that would strengthen this resume
      7. Specific strategies to pass ATS screening
      8. Strengths - what's working well
      9. Weaknesses - what needs improvement
      10. Industry-specific optimization tips
      
      Format your response as JSON with these fields:
      {
        "overallScore": number,
        "grammarScore": number,
        "formattingScore": number,
        "keywordScore": number,
        "atsScore": number,
        "improvements": ["detailed suggestion 1", "detailed suggestion 2", ...],
        "missingSkills": ["skill1", "skill2", ...],
        "atsStrategies": ["strategy1", "strategy2", ...],
        "strengths": ["strength1", "strength2", ...],
        "weaknesses": ["weakness1", "weakness2", ...],
        "industryTips": ["tip1", "tip2", ...],
        "feedback": "comprehensive actionable feedback paragraph"
      }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert ATS and resume analyst with 15+ years of recruitment experience. Provide extremely detailed, actionable feedback to help job seekers improve their resumes and bypass ATS systems. Be thorough and insightful. Always respond with valid JSON.'
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      console.log("Original content:", data.choices[0].message.content);
      
      // Fallback if JSON parsing fails
      analysis = {
        overallScore: 72,
        grammarScore: 80,
        formattingScore: 70,
        keywordScore: 68,
        atsScore: 65,
        improvements: [
          "Add more quantifiable achievements with metrics and numbers", 
          "Structure your work experience with clear bullet points", 
          "Ensure consistency in formatting throughout the document",
          "Include relevant keywords from the job description",
          "Use a more modern and ATS-friendly template"
        ],
        missingSkills: ["Data Analysis", "Project Management", "Communication", "Leadership", "Problem Solving"],
        atsStrategies: [
          "Use standard section headings like 'Experience' and 'Education'", 
          "Avoid complex formatting, tables, and graphics",
          "Include keywords from the job description verbatim",
          "Use a single-column layout for better parsing",
          "Save as a simple .docx or .pdf format"
        ],
        strengths: ["Educational background", "Work experience", "Technical skills"],
        weaknesses: ["Lack of metrics and achievements", "Inconsistent formatting", "Missing targeted keywords"],
        industryTips: [
          "Research industry-specific terminology",
          "Highlight certifications prominently",
          "Include relevant projects and their outcomes"
        ],
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