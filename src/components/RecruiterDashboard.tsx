import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Building, 
  Users, 
  Eye, 
  Edit,
  Trash2,
  TrendingUp,
  UserPlus,
  Briefcase,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  salary_min: number;
  salary_max: number;
  skills_required: string[];
  views_count: number;
  applications_count: number;
  created_at: string;
}

interface RecruiterProfile {
  company_name: string;
  company_description: string;
  company_website: string;
  company_size: string;
  industry: string;
}

export function RecruiterDashboard() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const { toast } = useToast();

  const [jobForm, setJobForm] = useState({
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

  const [profileForm, setProfileForm] = useState({
    company_name: '',
    company_description: '',
    company_website: '',
    company_size: '',
    industry: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch recruiter profile
      const { data: profileData } = await supabase
        .from('recruiter_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setProfileForm(profileData);

        // Fetch job postings
        const { data: jobsData } = await supabase
          .from('job_postings')
          .select('*')
          .eq('recruiter_id', user.id)
          .order('created_at', { ascending: false });

        setJobs(jobsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('recruiter_profiles')
        .insert({
          user_id: user.id,
          ...profileForm
        });

      if (error) throw error;

      toast({
        title: "Profile created!",
        description: "Your recruiter profile has been set up successfully.",
      });

      setShowProfileDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateJob = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const skillsArray = jobForm.skills_required.split(',').map(s => s.trim()).filter(s => s);

      const jobData = {
        recruiter_id: user.id,
        title: jobForm.title,
        description: jobForm.description,
        requirements: jobForm.requirements,
        location: jobForm.location,
        job_type: jobForm.job_type,
        experience_level: jobForm.experience_level,
        salary_min: parseInt(jobForm.salary_min) || null,
        salary_max: parseInt(jobForm.salary_max) || null,
        skills_required: skillsArray
      };

      if (editingJob) {
        const { error } = await supabase
          .from('job_postings')
          .update(jobData)
          .eq('id', editingJob.id);

        if (error) throw error;

        toast({
          title: "Job updated!",
          description: "Job posting has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('job_postings')
          .insert(jobData);

        if (error) throw error;

        toast({
          title: "Job posted!",
          description: "Your job posting is now live.",
        });
      }

      setShowJobDialog(false);
      setEditingJob(null);
      setJobForm({
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
      fetchData();
    } catch (error) {
      console.error('Error with job:', error);
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Job deleted",
        description: "Job posting has been removed.",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job.",
        variant: "destructive"
      });
    }
  };

  const startEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      job_type: job.job_type,
      experience_level: job.experience_level,
      salary_min: job.salary_min?.toString() || '',
      salary_max: job.salary_max?.toString() || '',
      skills_required: job.skills_required?.join(', ') || ''
    });
    setShowJobDialog(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Building className="h-6 w-6" />
              Welcome to Recruiter Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Set up your company profile to start posting jobs and finding the best candidates.
            </p>
            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Company Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Company Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Company Name"
                    value={profileForm.company_name}
                    onChange={(e) => setProfileForm({...profileForm, company_name: e.target.value})}
                  />
                  <Textarea
                    placeholder="Company Description"
                    value={profileForm.company_description}
                    onChange={(e) => setProfileForm({...profileForm, company_description: e.target.value})}
                  />
                  <Input
                    placeholder="Company Website"
                    value={profileForm.company_website}
                    onChange={(e) => setProfileForm({...profileForm, company_website: e.target.value})}
                  />
                  <Select value={profileForm.company_size} onValueChange={(value) => setProfileForm({...profileForm, company_size: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Company Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Industry"
                    value={profileForm.industry}
                    onChange={(e) => setProfileForm({...profileForm, industry: e.target.value})}
                  />
                  <Button onClick={handleCreateProfile} className="w-full">
                    Create Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalViews = jobs.reduce((sum, job) => sum + job.views_count, 0);
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications_count, 0);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Recruiter Dashboard
          </h1>
          <p className="text-muted-foreground">{profile.company_name}</p>
        </div>
        <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit Job' : 'Post New Job'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Job Title"
                value={jobForm.title}
                onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
              />
              <Input
                placeholder="Location"
                value={jobForm.location}
                onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
              />
              <Select value={jobForm.job_type} onValueChange={(value) => setJobForm({...jobForm, job_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              <Select value={jobForm.experience_level} onValueChange={(value) => setJobForm({...jobForm, experience_level: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Min Salary"
                type="number"
                value={jobForm.salary_min}
                onChange={(e) => setJobForm({...jobForm, salary_min: e.target.value})}
              />
              <Input
                placeholder="Max Salary"
                type="number"
                value={jobForm.salary_max}
                onChange={(e) => setJobForm({...jobForm, salary_max: e.target.value})}
              />
              <div className="md:col-span-2">
                <Textarea
                  placeholder="Job Description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  placeholder="Requirements"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  placeholder="Required Skills (comma separated)"
                  value={jobForm.skills_required}
                  onChange={(e) => setJobForm({...jobForm, skills_required: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Button onClick={handleCreateJob} className="w-full">
                  {editingJob ? 'Update Job' : 'Post Job'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-scale bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center mr-4">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{jobs.length}</p>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale bg-gradient-to-r from-secondary/10 to-green-500/10 border-secondary/20">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-secondary to-green-500 flex items-center justify-center mr-4">
              <Eye className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalViews}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/20">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-accent to-purple-500 flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalApplications}</p>
              <p className="text-sm text-muted-foreground">Applications</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0}
              </p>
              <p className="text-sm text-muted-foreground">Avg Applications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Your Job Postings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No job postings yet. Create your first job posting!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <Badge variant="secondary">{job.job_type}</Badge>
                        <Badge variant="outline">{job.experience_level}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{job.location}</p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills_required?.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {job.views_count} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.applications_count} applications
                        </span>
                        {job.salary_min && job.salary_max && (
                          <span>${job.salary_min}k - ${job.salary_max}k</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditJob(job)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}