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
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-800/50 p-6 hover:bg-zinc-900/90 transition-all duration-200 h-full flex flex-col">
      <div className="pb-4 border-b border-zinc-800">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-zinc-100 line-clamp-2">{job.title}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Building className="h-4 w-4 text-zinc-400 flex-shrink-0" />
              <span className="font-medium text-zinc-200 truncate">{job.company}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-zinc-400">
                  {job.companyRating} ({job.companyReviews})
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="text-xs bg-zinc-700 text-zinc-200 border-zinc-600">{job.type}</Badge>
            {isNewJob && <Badge className="bg-emerald-600 hover:bg-emerald-700 text-zinc-100 text-xs">New</Badge>}
          </div>
        </div>
      </div>
      
      <div className="pt-6 flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div className="flex flex-col gap-2 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{job.experience}</span>
            </div>
          </div>
          
          <div className="text-lg font-semibold text-emerald-400">
            {job.salary}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
          
          <p className="text-sm text-zinc-400 line-clamp-2 flex-1">
            {job.description}
          </p>
        </div>
        
        <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800 mt-4">
          <span className="text-xs text-zinc-500">
            {formatDate(job.postedDate)}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => onViewDetails(job)}
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-300 bg-transparent border border-zinc-600 rounded-lg hover:bg-zinc-800 transition-colors duration-200"
            >
              View Details
            </button>
            <button 
              onClick={handleApply}
              className="flex-1 px-4 py-2 text-sm font-medium bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors duration-200"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}