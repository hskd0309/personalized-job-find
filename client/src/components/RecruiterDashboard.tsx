import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Plus, 
  Users, 
  Eye, 
  Edit,
  Trash2,
  TrendingUp,
  MapPin,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationManagement } from '@/components/ApplicationManagement';

interface JobPosting {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  skills_required: string[];
  is_active: boolean;
  applications_count: number;
  views_count: number;
  created_at: string;
}

export function RecruiterDashboard() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState<JobPosting | null>(null);
  const { toast } = useToast();

  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: '',
    salary_max: '',
    skills_required: ''
  });

  useEffect(() => {
    checkRecruiterStatus();
    loadJobPostings();
  }, []);

  const checkRecruiterStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single();

      setIsRecruiter(profile?.user_type === 'recruiter');
    } catch (error) {
      console.error('Error checking recruiter status:', error);
    }
  };

  const loadJobPostings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: jobs, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobPostings(jobs || []);
    } catch (error) {
      console.error('Error loading job postings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRecruiterProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ user_type: 'recruiter', company_name: 'Your Company' })
        .eq('user_id', user.id);

      if (error) throw error;

      setIsRecruiter(true);
      toast({
        title: "Recruiter profile created!",
        description: "You can now post jobs and manage applications",
      });
    } catch (error) {
      console.error('Error creating recruiter profile:', error);
      toast({
        title: "Failed to create recruiter profile",
        variant: "destructive",
      });
    }
  };

  const createJobPosting = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const skillsArray = newJob.skills_required.split(',').map(s => s.trim()).filter(Boolean);

      const { error } = await supabase
        .from('job_postings')
        .insert({
          user_id: user.id,
          title: newJob.title,
          description: newJob.description,
          requirements: newJob.requirements,
          location: newJob.location,
          job_type: newJob.job_type,
          experience_level: newJob.experience_level,
          salary_min: newJob.salary_min ? parseInt(newJob.salary_min) : null,
          salary_max: newJob.salary_max ? parseInt(newJob.salary_max) : null,
          skills_required: skillsArray
        });

      if (error) throw error;

      toast({
        title: "Job posted successfully!",
        description: "Your job posting is now live",
      });

      setShowCreateJob(false);
      setNewJob({
        title: '',
        description: '',
        requirements: '',
        location: '',
        job_type: 'full-time',
        experience_level: 'mid',
        salary_min: '',
        salary_max: '',
        skills_required: ''
      });
      loadJobPostings();
    } catch (error) {
      console.error('Error creating job posting:', error);
      toast({
        title: "Failed to create job posting",
        variant: "destructive",
      });
    }
  };

  if (!isRecruiter) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <Building className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Become a Recruiter</h2>
            <p className="text-muted-foreground mb-6">
              Join our platform as a recruiter to post jobs and find the best candidates
            </p>
            <Button 
              onClick={createRecruiterProfile}
               className="bg-black hover:bg-gray-600 text-white"
            >
              Set Up Recruiter Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedJobForApplications) {
    return (
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedJobForApplications(null)}
          >
            ← Back to Dashboard
          </Button>
        </div>
        <ApplicationManagement 
          jobId={selectedJobForApplications.id} 
          jobTitle={selectedJobForApplications.title} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Recruiter Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your job postings and applications</p>
        </div>
        
        <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-600 text-white w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-2 sm:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Job Posting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    placeholder="e.g., Senior React Developer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="e.g., Remote, New York"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  placeholder="Describe the role and responsibilities..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Requirements</label>
                <Textarea
                  placeholder="List the required qualifications..."
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Job Type</label>
                  <Select value={newJob.job_type} onValueChange={(value) => setNewJob({...newJob, job_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Experience Level</label>
                  <Select value={newJob.experience_level} onValueChange={(value) => setNewJob({...newJob, experience_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Min Salary ($)</label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={newJob.salary_min}
                    onChange={(e) => setNewJob({...newJob, salary_min: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Salary ($)</label>
                  <Input
                    type="number"
                    placeholder="80000"
                    value={newJob.salary_max}
                    onChange={(e) => setNewJob({...newJob, salary_max: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Required Skills (comma-separated)</label>
                <Input
                  placeholder="React, TypeScript, Node.js"
                  value={newJob.skills_required}
                  onChange={(e) => setNewJob({...newJob, skills_required: e.target.value})}
                />
              </div>

              <Button 
                onClick={createJobPosting} 
                className="w-full bg-black hover:bg-gray-600 text-white"
                disabled={!newJob.title || !newJob.description}
              >
                Post Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-xl sm:text-2xl font-bold">{jobPostings.filter(j => j.is_active).length}</p>
              </div>
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/10 to-green-500/10 border-secondary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Applications</p>
                <p className="text-xl sm:text-2xl font-bold">{jobPostings.reduce((sum, job) => sum + job.applications_count, 0)}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Views</p>
                <p className="text-xl sm:text-2xl font-bold">{jobPostings.reduce((sum, job) => sum + job.views_count, 0)}</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Postings */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Your Job Postings</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-8">Loading job postings...</div>
          ) : jobPostings.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-sm sm:text-base">No job postings yet. Create your first job posting!</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {jobPostings.map((job, index) => (
                <Card key={job.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold">{job.title}</h3>
                          <Badge variant={job.is_active ? "default" : "secondary"} className="text-xs">
                            {job.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                            {job.applications_count} applications
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            {job.views_count} views
                          </div>
                          {job.salary_min && job.salary_max && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="text-xs sm:text-sm">
                                ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        {job.skills_required && (
                          <div className="flex flex-wrap gap-1">
                            {job.skills_required.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                       <div className="flex gap-2 w-full sm:w-auto">
                         <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                           <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                           <span className="ml-1 sm:hidden">Edit</span>
                         </Button>
                         <Button 
                           variant="outline" 
                           size="sm" 
                           className="flex-1 sm:flex-none"
                           onClick={() => setSelectedJobForApplications(job)}
                         >
                           <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                           <span className="ml-1 sm:hidden">Applications</span>
                         </Button>
                         <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                           <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                           <span className="ml-1 sm:hidden">Delete</span>
                         </Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}