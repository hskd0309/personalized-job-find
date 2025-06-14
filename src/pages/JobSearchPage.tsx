import { useState, useMemo } from 'react';
import { JobSearch, SearchFilters } from '@/components/JobSearch';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { allJobs, Job } from '@/data/jobs';

export function JobSearchPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    location: '',
    jobType: '',
    experience: '',
    salary: '',
    category: ''
  });

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
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
      if (filters.jobType && job.type !== filters.jobType) {
        return false;
      }

      // Experience filter
      if (filters.experience) {
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
      if (filters.salary) {
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
      if (filters.category && job.category !== filters.category) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Search and Filters */}
      <JobSearch 
        onSearch={setFilters} 
        totalJobs={filteredJobs.length}
      />

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            onViewDetails={handleViewDetails}
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
    </div>
  );
}