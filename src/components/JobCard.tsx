import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Clock, Star, Users } from 'lucide-react';
import { Job } from '@/data/jobs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onApply?: (job: Job) => void;
}

export function JobCard({ job, onViewDetails, onApply }: JobCardProps) {
  const { toast } = useToast();
  const isNewJob = job.category === 'New';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleApply = () => {
    if (isNewJob && onApply) {
      onApply(job);
    } else {
      // Legacy apply for static jobs
      applyToStaticJob();
    }
  };

  const applyToStaticJob = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to apply for jobs",
          variant: "destructive",
        });
        return;
      }

      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_id', job.id)
        .single();

      if (existingApplication) {
        toast({
          title: "Already applied",
          description: "You have already applied to this job",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('applications')
        .insert([{
          user_id: user.id,
          job_id: job.id,
          job_title: job.title,
          company_name: job.company,
          location: job.location,
          status: 'Applied'
        }]);

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg line-clamp-2">{job.title}</CardTitle>
            <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
              <Building className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base truncate">{job.company}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {job.companyRating} ({job.companyReviews})
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <Badge variant="secondary" className="text-xs">{job.type}</Badge>
            {isNewJob && <Badge className="bg-green-600 hover:bg-green-700 text-xs">New</Badge>}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>{job.experience}</span>
            </div>
          </div>
          
          <div className="text-base sm:text-lg font-semibold text-green-600">
            {job.salary}
          </div>
          
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {job.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(job.postedDate)}
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(job)}
                className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
              >
                View Details
              </Button>
              <Button 
                size="sm" 
                onClick={handleApply}
                className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}