import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase, Star, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JobMatch {
  id: string;
  title: string;
  company_name?: string;
  location?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  skills_required?: string[];
  description: string;
  requirements: string;
  created_at: string;
  match_score?: number;
}

export function PersonalizedJobFinder() {
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  // Load user's existing skills from profile
  useEffect(() => {
    loadUserSkills();
  }, []);

  const loadUserSkills = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('skills')
        .eq('user_id', user.id)
        .single();

      if (profile?.skills) {
        setUserSkills(profile.skills);
      }
    } catch (error) {
      console.error('Error loading user skills:', error);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !userSkills.includes(skillInput.trim())) {
      const newSkills = [...userSkills, skillInput.trim()];
      setUserSkills(newSkills);
      setSkillInput('');
      saveSkillsToProfile(newSkills);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = userSkills.filter(skill => skill !== skillToRemove);
    setUserSkills(newSkills);
    saveSkillsToProfile(newSkills);
  };

  const saveSkillsToProfile = async (skills: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({ skills })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error saving skills:', error);
    }
  };

  const findMatchingJobs = async () => {
    if (userSkills.length === 0) {
      toast({
        title: "No skills added",
        description: "Please add some skills to find matching jobs.",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    try {
      let query = supabase
        .from('job_postings')
        .select(`
          *,
          profiles!job_postings_user_id_fkey(company_name)
        `)
        .eq('is_active', true);

      // Filter by location if specified
      if (location.trim()) {
        query = query.ilike('location', `%${location.trim()}%`);
      }

      // Filter by job type if specified
      if (jobType) {
        query = query.eq('job_type', jobType);
      }

      const { data: jobs, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate match scores based on skill overlap
      const jobsWithScores = jobs?.map(job => {
        const jobSkills = job.skills_required || [];
        const matchedSkills = userSkills.filter(skill => 
          jobSkills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );
        
        const matchScore = jobSkills.length > 0 
          ? Math.round((matchedSkills.length / jobSkills.length) * 100)
          : 0;

        return {
          ...job,
          company_name: job.profiles?.company_name || 'Company Name',
          match_score: matchScore
        };
      }) || [];

      // Sort by match score descending, then by creation date
      const sortedJobs = jobsWithScores
        .filter(job => job.match_score > 0 || userSkills.length === 0)
        .sort((a, b) => {
          if (a.match_score !== b.match_score) {
            return b.match_score - a.match_score;
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

      setMatchedJobs(sortedJobs);
      
      if (sortedJobs.length === 0) {
        toast({
          title: "No matching jobs found",
          description: "Try adjusting your skills or search criteria.",
        });
      } else {
        toast({
          title: "Jobs found!",
          description: `Found ${sortedJobs.length} matching jobs for your skills.`,
        });
      }
    } catch (error) {
      console.error('Error finding jobs:', error);
      toast({
        title: "Error",
        description: "Failed to search for jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `₹${(min/100000).toFixed(1)}L - ₹${(max/100000).toFixed(1)}L`;
    if (min) return `₹${(min/100000).toFixed(1)}L+`;
    return 'Competitive salary';
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Personalized Job Finder
        </h1>
        <p className="text-lg text-gray-600">
          Add your skills and find jobs that match your expertise
        </p>
      </div>

      {/* Skills Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Skill */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill (e.g., React, Python, Marketing)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1"
            />
            <Button onClick={addSkill} disabled={!skillInput.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Skills Display */}
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="flex items-center gap-1 px-3 py-1"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {userSkills.length === 0 && (
              <p className="text-gray-500 text-sm">
                No skills added yet. Add your skills to find personalized job matches.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                placeholder="e.g., Mumbai, Bangalore, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select
                className="w-full h-10 px-3 py-2 border border-gray-200 rounded-md bg-white"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">Any</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={findMatchingJobs} 
                disabled={searching}
                className="w-full"
              >
                {searching ? (
                  <>Finding Jobs...</>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Find Matching Jobs
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Results */}
      <div className="space-y-4">
        {matchedJobs.length > 0 && (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Found {matchedJobs.length} matching jobs
            </h2>
            <p className="text-sm text-gray-600">
              Sorted by skill match percentage
            </p>
          </div>
        )}

        {matchedJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.company_name}
                  </p>
                </div>
                {job.match_score !== undefined && (
                  <Badge className={`${getMatchColor(job.match_score)} font-semibold`}>
                    {job.match_score}% Match
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {job.location || 'Location not specified'}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  {job.job_type || 'Full-time'}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  {formatSalary(job.salary_min, job.salary_max)}
                </div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2">
                {job.description}
              </p>

              {job.skills_required && job.skills_required.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant={userSkills.some(userSkill => 
                          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                          skill.toLowerCase().includes(userSkill.toLowerCase())
                        ) ? "default" : "outline"}
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </p>
                <Button size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {!searching && matchedJobs.length === 0 && userSkills.length > 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No matching jobs found
              </h3>
              <p className="text-gray-600">
                Try adjusting your skills or search filters to find more opportunities.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}