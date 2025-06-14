import { useState, useMemo, useEffect } from 'react';
import { JobSearch, SearchFilters } from '@/components/JobSearch';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { ApplicationModal } from '@/components/ApplicationModal';
import { allJobs, Job } from '@/data/jobs';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface DatabaseJob {
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
  applications_count: number;
  views_count: number;
  created_at: string;
  company_name?: string;
  isNew?: boolean;
}

// Convert database job to Job format for compatibility
const convertToJob = (dbJob: DatabaseJob): Job => ({
  id: dbJob.id,
  title: dbJob.title,
  company: dbJob.company_name || 'Company Name',
  location: dbJob.location || '',
  type: (dbJob.job_type as 'full-time' | 'part-time' | 'contract' | 'remote') || 'full-time',
  salary: dbJob.salary_min && dbJob.salary_max 
    ? `₹${(dbJob.salary_min/100000).toFixed(1)}L - ₹${(dbJob.salary_max/100000).toFixed(1)}L`
    : 'Salary not disclosed',
  experience: `${dbJob.experience_level || 'entry'} level`,
  description: dbJob.description,
  requirements: dbJob.requirements ? dbJob.requirements.split('\n') : [],
  benefits: [],
  postedDate: new Date(dbJob.created_at).toLocaleDateString(),
  category: 'New',
  skills: dbJob.skills_required || [],
  companyRating: 4.0,
  companyReviews: 100
});

export function JobSearchPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<DatabaseJob | null>(null);
  const [databaseJobs, setDatabaseJobs] = useState<DatabaseJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    location: '',
    jobType: '',
    experience: '',
    salary: '',
    category: ''
  });

  useEffect(() => {
    loadDatabaseJobs();
  }, []);

  const loadDatabaseJobs = async () => {
    try {
      const { data: jobs, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get company names for each job
      const jobsWithCompanies: DatabaseJob[] = [];
      for (const job of jobs || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('user_id', job.user_id)
          .single();
        
        jobsWithCompanies.push({
          ...job,
          company_name: profile?.company_name || 'Company Name',
          isNew: true
        });
      }
      
      setDatabaseJobs(jobsWithCompanies);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine static and database jobs
  const allAvailableJobs = useMemo(() => {
    const convertedDbJobs = databaseJobs.map(convertToJob);
    const staticJobs = filters.category === 'New' ? [] : allJobs;
    const newJobs = filters.category !== 'New' && filters.category !== '' && filters.category !== 'all' ? [] : convertedDbJobs;
    return [...newJobs, ...staticJobs];
  }, [databaseJobs, filters.category]);

  const filteredJobs = useMemo(() => {
    return allAvailableJobs.filter(job => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        if (!job.location.toLowerCase().includes(locationLower)) {
          return false;
        }
      }

      // Job type filter
      if (filters.jobType && filters.jobType !== 'all' && job.type !== filters.jobType) {
        return false;
      }

      // Experience filter
      if (filters.experience && filters.experience !== 'all') {
        const jobExpNum = parseInt(job.experience);
        switch (filters.experience) {
          case 'entry':
            if (jobExpNum > 2) return false;
            break;
          case 'mid':
            if (jobExpNum < 3 || jobExpNum > 5) return false;
            break;
          case 'senior':
            if (jobExpNum < 5) return false;
            break;
        }
      }

      // Salary filter
      if (filters.salary && filters.salary !== 'all') {
        // Extract salary numbers from INR format (₹X.XL - ₹Y.YL)
        const salaryMatch = job.salary.match(/₹(\d+\.?\d*)L/g);
        if (salaryMatch && salaryMatch.length >= 2) {
          const minSalary = parseFloat(salaryMatch[0].replace('₹', '').replace('L', ''));
          const maxSalary = parseFloat(salaryMatch[1].replace('₹', '').replace('L', ''));
          const avgSalary = (minSalary + maxSalary) / 2;
          
          switch (filters.salary) {
            case '4-8':
              if (avgSalary < 4 || avgSalary > 8) return false;
              break;
            case '8-15':
              if (avgSalary < 8 || avgSalary > 15) return false;
              break;
            case '15-25':
              if (avgSalary < 15 || avgSalary > 25) return false;
              break;
            case '25+':
              if (avgSalary < 25) return false;
              break;
          }
        }
      }

      // Category filter
      if (filters.category && filters.category !== 'all' && job.category !== filters.category) {
        return false;
      }

      return true;
    });
  }, [allAvailableJobs, filters]);

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };

  const handleApply = (job: Job) => {
    // Find the original database job for the application
    const dbJob = databaseJobs.find(dbJ => dbJ.id === job.id);
    if (dbJob) {
      setJobToApply(dbJob);
      setIsApplicationModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Search and Filters */}
      <JobSearch 
        onSearch={setFilters} 
        totalJobs={filteredJobs.length}
      />

      {/* Job Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
         {filteredJobs.map(job => (
           <JobCard 
             key={job.id} 
             job={job} 
             onViewDetails={handleViewDetails}
             onApply={handleApply}
           />
         ))}
      </div>

      {/* No Results */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No jobs found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      <JobDetails
        job={selectedJob}
        isOpen={isJobDetailsOpen}
        onClose={() => {
          setIsJobDetailsOpen(false);
          setSelectedJob(null);
        }}
      />

      {/* Application Modal */}
      <ApplicationModal
        job={jobToApply}
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setJobToApply(null);
          loadDatabaseJobs(); // Refresh to update application counts
        }}
      />
    </div>
  );
}