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

    const { userId, userSkills, userExperience, userEducation } = await req.json();

    // Get all active job postings
    const { data: jobs, error: jobsError } = await supabaseClient
      .from('job_postings')
      .select('*')
      .eq('is_active', true);

    if (jobsError) {
      throw new Error(`Failed to fetch jobs: ${jobsError.message}`);
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Calculate matches for each job
    const jobMatches = [];

    for (const job of jobs || []) {
      const matchingPrompt = `
        Calculate a job match score (0-100) between this candidate and job posting:
        
        Candidate Profile:
        - Skills: ${userSkills?.join(', ') || 'None specified'}
        - Experience: ${userExperience || 'Not specified'}
        - Education: ${userEducation || 'Not specified'}
        
        Job Posting:
        - Title: ${job.title}
        - Requirements: ${job.requirements}
        - Required Skills: ${job.skills_required?.join(', ') || 'None specified'}
        - Experience Level: ${job.experience_level || 'Not specified'}
        
        Provide a match score and specific reasons why this is a good/poor match.
        Format as JSON: {
          "matchScore": number,
          "reasons": ["reason1", "reason2"],
          "missingSkills": ["skill1", "skill2"]
        }
      `;

      try {
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
                content: 'You are an expert job matching algorithm. Analyze candidate profiles against job requirements and provide accurate match scores with detailed reasoning.' 
              },
              { role: 'user', content: matchingPrompt }
            ],
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let matchData;
          
          try {
            matchData = JSON.parse(data.choices[0].message.content);
          } catch {
            matchData = {
              matchScore: 50,
              reasons: ["Unable to analyze match"],
              missingSkills: []
            };
          }

          jobMatches.push({
            jobId: job.id,
            job: job,
            matchScore: matchData.matchScore,
            reasons: matchData.reasons,
            missingSkills: matchData.missingSkills
          });
        }
      } catch (error) {
        console.error(`Error matching job ${job.id}:`, error);
        // Add with default score if AI fails
        jobMatches.push({
          jobId: job.id,
          job: job,
          matchScore: 50,
          reasons: ["Unable to calculate match"],
          missingSkills: []
        });
      }
    }

    // Sort by match score descending
    jobMatches.sort((a, b) => b.matchScore - a.matchScore);

    // Store matches in database
    for (const match of jobMatches) {
      await supabaseClient
        .from('job_matches')
        .upsert({
          user_id: userId,
          job_id: match.jobId,
          match_score: match.matchScore,
          match_reasons: match.reasons
        });
    }

    return new Response(JSON.stringify({ 
      matches: jobMatches.slice(0, 10), // Return top 10 matches
      totalJobs: jobs?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in job-matcher function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to match jobs', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});