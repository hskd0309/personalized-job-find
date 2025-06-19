import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  MapPin, 
  Building, 
  Clock,
  ExternalLink,
  Heart,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface JobMatch {
  jobId: string;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    company_name: string;
    skills_required: string[];
    experience_level: string;
    salary_min?: number;
    salary_max?: number;
    created_at: string;
  };
  matchScore: number;
  reasons: string[];
}

export function JobMatchDashboard() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    findJobMatches();
  }, []);

  const findJobMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get active job postings
      const { data: jobPostings } = await supabase
        .from('job_postings')
        .select('*')
        .eq('is_active', true)
        .limit(20);

      if (!jobPostings || !profile) return;

      // Call job matcher function
      const response = await supabase.functions.invoke('job-matcher', {
        body: {
          userSkills: profile.skills || [],
          userExperience: Array.isArray(profile.experience) ? profile.experience.length : 0,
          jobPostings
        }
      });

      if (response.error) throw response.error;

      setMatches(response.data.matches || []);

      // Save matches to database
      for (const match of response.data.matches || []) {
        await supabase
          .from('job_matches')
          .upsert({
            user_id: user.id,
            job_id: match.jobId,
            match_score: match.matchScore,
            match_reasons: match.reasons
          }, {
            onConflict: 'user_id,job_id'
          });
      }

    } catch (error) {
      console.error('Error finding job matches:', error);
      toast({
        title: "Failed to find job matches",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const job = matches.find(m => m.jobId === jobId)?.job;
      if (!job) return;

      await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          job_id: jobId,
          job_title: job.title,
          company_name: job.company_name || 'Unknown Company',
          location: job.location,
          status: 'Applied'
        });

      // Update match as applied
      await supabase
        .from('job_matches')
        .update({ applied: true })
        .eq('user_id', user.id)
        .eq('job_id', jobId);

      toast({
        title: "Application submitted!",
        description: `Applied to ${job.title}`,
      });

    } catch (error) {
      console.error('Application error:', error);
      toast({
        title: "Application failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Finding your perfect job matches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 space-y-6">
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
        <div className="flex items-center gap-2 text-zinc-100">
          <Target className="h-5 w-5" />
          <h2 className="text-xl font-semibold">AI Job Matches ({matches.length})</h2>
        </div>
      </div>

      <div className="grid gap-4">
        {matches.map((match, index) => (
          <div 
            key={match.jobId} 
            className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6 hover:bg-zinc-900/90 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-zinc-100">{match.job.title}</h3>
                  <Badge 
                    className={`
                      ${match.matchScore >= 80 ? 'bg-emerald-600 text-zinc-100' : 
                        match.matchScore >= 60 ? 'bg-yellow-600 text-zinc-100' : 
                        'bg-orange-600 text-zinc-100'}
                    `}
                  >
                    {match.matchScore}% Match
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-zinc-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {match.job.company_name || 'Company Name'}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {match.job.location || 'Remote'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(match.job.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-lg h-2 mb-3">
                  <div 
                    className="bg-emerald-400 h-2 rounded-lg transition-all duration-300" 
                    style={{ width: `${match.matchScore}%` }}
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-zinc-200">Why you're a good fit:</h4>
                    <ul className="text-sm text-zinc-400 space-y-1">
                      {match.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {match.job.skills_required && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-zinc-200">Required Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {match.job.skills_required.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleApply(match.jobId)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium"
                >
                  Apply Now
                </button>
                <button className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors duration-200 text-sm">
                  <Eye className="h-4 w-4 mr-1 inline" />
                  View Details
                </button>
                <button className="px-4 py-2 text-zinc-400 hover:text-zinc-200 transition-colors duration-200 text-sm">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>

            {match.job.salary_min && match.job.salary_max && (
              <div className="text-sm text-zinc-400">
                Salary: ${match.job.salary_min.toLocaleString()} - ${match.job.salary_max.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-8 text-center">
          <div className="space-y-2">
            <Target className="h-12 w-12 mx-auto text-zinc-400" />
            <h3 className="font-semibold text-zinc-200">No job matches found</h3>
            <p className="text-sm text-zinc-400">
              Complete your profile and upload a resume to get personalized job recommendations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}