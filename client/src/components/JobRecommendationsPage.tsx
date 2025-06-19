import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Briefcase,
  RefreshCw,
  Award,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { allJobs, Job } from '@/data/jobs';

interface JobRecommendation extends Job {
  matchScore: number;
  reasons: string[];
  matchedSkills: string[];
}

export function JobRecommendationsPage() {
  const [matches, setMatches] = useState<JobRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Job Recommendations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get personalized job recommendations based on your skills
          </p>
        </div>

        {/* Skills Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Skill */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g., React, Python, Project Management)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1"
              />
              <Button onClick={addSkill} disabled={!newSkill.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>

            {/* Skills Display */}
            {userSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No skills added yet. Add your skills to get personalized job recommendations.
              </p>
            )}

            {/* Generate Recommendations Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={generateNewMatches} 
                disabled={isGenerating || userSkills.length === 0}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Find Job Matches
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}