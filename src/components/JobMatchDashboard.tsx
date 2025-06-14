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
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Target className="h-5 w-5" />
            AI Job Matches ({matches.length})
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {matches.map((match, index) => (
          <Card 
            key={match.jobId} 
            className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-background to-accent/5 border-l-4 border-l-primary animate-slide-in-right"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{match.job.title}</h3>
                    <Badge 
                      className={`
                        ${match.matchScore >= 80 ? 'bg-green-100 text-green-800' : 
                          match.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-orange-100 text-orange-800'}
                      `}
                    >
                      {match.matchScore}% Match
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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

                  <Progress value={match.matchScore} className="mb-3" />

                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Why you're a good fit:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {match.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {match.job.skills_required && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Required Skills:</h4>
                        <div className="flex flex-wrap gap-1">
                          {match.job.skills_required.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleApply(match.jobId)}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    Apply Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {match.job.salary_min && match.job.salary_max && (
                <div className="text-sm text-muted-foreground">
                  Salary: ${match.job.salary_min.toLocaleString()} - ${match.job.salary_max.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {matches.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <Target className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="font-semibold">No job matches found</h3>
            <p className="text-sm text-muted-foreground">
              Complete your profile and upload a resume to get personalized job recommendations.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}