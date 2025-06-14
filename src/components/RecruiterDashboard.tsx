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
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Set Up Recruiter Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Recruiter Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your job postings and applications</p>
        </div>
        
        <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Job Posting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                disabled={!newJob.title || !newJob.description}
              >
                Post Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">{jobPostings.filter(j => j.is_active).length}</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/10 to-green-500/10 border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{jobPostings.reduce((sum, job) => sum + job.applications_count, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{jobPostings.reduce((sum, job) => sum + job.views_count, 0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Postings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading job postings...</div>
          ) : jobPostings.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No job postings yet. Create your first job posting!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobPostings.map((job, index) => (
                <Card key={job.id} className="animate-slide-in-right" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge variant={job.is_active ? "default" : "secondary"}>
                            {job.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applications_count} applications
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {job.views_count} views
                          </div>
                          {job.salary_min && job.salary_max && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
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

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
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