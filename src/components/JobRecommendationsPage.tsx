import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  TrendingUp,
  Eye,
  Heart,
  ExternalLink,
  Zap,
  Users,
  Briefcase
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JobMatch {
  jobId: string;
  job: {
    id: string;
    title: string;
    description: string;
    requirements: string;
    location: string;
    job_type: string;
    experience_level: string;
    salary_min: number;
    salary_max: number;
    skills_required: string[];
    views_count: number;
    applications_count: number;
    created_at: string;
  };
  matchScore: number;
  reasons: string[];
  missingSkills: string[];
}

export function JobRecommendationsPage() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobMatches();
  }, []);

  const fetchJobMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get existing matches
      const { data: existingMatches } = await supabase
        .from('job_matches')
        .select(`
          *,
          job_postings (*)
        `)
        .eq('user_id', user.id)
        .order('match_score', { ascending: false });

      if (existingMatches && existingMatches.length > 0) {
        const formattedMatches = existingMatches.map(match => ({
          jobId: match.job_id,
          job: {
            ...match.job_postings,
            // Add realistic salary ranges in INR if missing
            salary_min: match.job_postings?.salary_min || (400000 + Math.floor(Math.random() * 600000)), // 4L to 10L
            salary_max: match.job_postings?.salary_max || (800000 + Math.floor(Math.random() * 1200000)) // 8L to 20L
          },
          matchScore: typeof match.match_score === 'string' ? parseFloat(match.match_score) : match.match_score,
          reasons: match.match_reasons || [],
          missingSkills: []
        }));
        setMatches(formattedMatches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewMatches = async () => {
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('skills, experience')
        .eq('user_id', user.id)
        .single();

      const response = await supabase.functions.invoke('job-matcher', {
        body: {
          userId: user.id,
          userSkills: profile?.skills || [],
          userExperience: profile?.experience || 'Not specified',
          userEducation: 'Not specified'
        }
      });

      if (response.error) throw response.error;

      setMatches(response.data.matches || []);
      toast({
        title: "Job matches updated!",
        description: `Found ${response.data.matches?.length || 0} matching opportunities.`,
      });

    } catch (error) {
      console.error('Error generating matches:', error);
      toast({
        title: "Failed to generate matches",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyToJob = async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get job details
      const job = matches.find(m => m.jobId === jobId)?.job;
      if (!job) return;

      // Create application
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          job_id: jobId,
          job_title: job.title,
          company_name: 'Company Name', // You might want to get this from recruiter profile
          location: job.location,
          status: 'Applied',
          applied_date: new Date().toISOString()
        });

      if (error) throw error;

      // Update match status
      await supabase
        .from('job_matches')
        .update({ applied: true })
        .eq('user_id', user.id)
        .eq('job_id', jobId);

      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the recruiter.",
      });

      // Update local state
      setMatches(prev => prev.map(match => 
        match.jobId === jobId 
          ? { ...match } 
          : match
      ));

    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: "Application failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMatchBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-zinc-100">
            AI Job Recommendations
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Discover personalized job opportunities matched to your skills and experience using AI.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={generateNewMatches}
            disabled={isGenerating}
            className="px-6 py-3 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Zap className="h-4 w-4 mr-2 inline" />
                Generating Matches...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2 inline" />
                Find New Matches
              </>
            )}
          </button>
        </div>

        {/* Job Matches */}
        {matches.length === 0 ? (
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-8 text-center max-w-2xl mx-auto">
            <Target className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-zinc-200">No Job Matches Yet</h3>
            <p className="text-zinc-400 mb-4">
              Click "Find New Matches" to discover personalized job opportunities.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match, index) => (
              <div key={match.jobId} className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6 hover:bg-zinc-900/90 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-zinc-100">{match.job.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-lg border ${
                        match.matchScore >= 80 ? 'bg-emerald-600 text-zinc-100 border-emerald-500' : 
                        match.matchScore >= 60 ? 'bg-yellow-600 text-zinc-100 border-yellow-500' : 
                        'bg-orange-600 text-zinc-100 border-orange-500'
                      }`}>
                        <Star className="h-3 w-3 inline mr-1" />
                        {match.matchScore}% Match
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {match.job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {match.job.job_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {match.job.experience_level}
                      </span>
                      {match.job.salary_min && match.job.salary_max && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ₹{(match.job.salary_min/100000).toFixed(1)}L - ₹{(match.job.salary_max/100000).toFixed(1)}L
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-400 mb-4 line-clamp-2">
                      {match.job.description}
                    </p>
                  </div>
                  <div className="text-center ml-6">
                    <div className={`text-3xl font-bold mb-2 ${
                      match.matchScore >= 80 ? 'text-emerald-400' : 
                      match.matchScore >= 60 ? 'text-yellow-400' : 
                      'text-orange-400'
                    }`}>
                      {match.matchScore}%
                    </div>
                    <div className="bg-zinc-800 rounded-lg h-2 w-20">
                      <div 
                        className={`h-2 rounded-lg transition-all duration-300 ${
                          match.matchScore >= 80 ? 'bg-emerald-400' : 
                          match.matchScore >= 60 ? 'bg-yellow-400' : 
                          'bg-orange-400'
                        }`} 
                        style={{ width: `${match.matchScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 text-zinc-200">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.job.skills_required?.slice(0, 6).map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match Reasons */}
                {match.reasons.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 text-zinc-200">Why this matches you:</h4>
                    <ul className="text-sm text-zinc-400 space-y-1">
                      {match.reasons.slice(0, 3).map((reason, reasonIndex) => (
                        <li key={reasonIndex} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {match.job.views_count} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {match.job.applications_count} applications
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors duration-200 text-sm">
                      <ExternalLink className="h-4 w-4 mr-2 inline" />
                      View Details
                    </button>
                    <button 
                      onClick={() => applyToJob(match.jobId)}
                      className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <Heart className="h-4 w-4 mr-2 inline" />
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}