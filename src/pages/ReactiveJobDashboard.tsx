import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase, Star, ExternalLink } from 'lucide-react';
import { ReactiveButton } from '@/components/ui/reactive-button';
import { ReactiveCard } from '@/components/ui/reactive-card';
import { ReactiveInput } from '@/components/ui/reactive-input';

export function ReactiveJobDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    type: '',
    salary: ''
  });

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $160k',
      posted: '2 days ago',
      match: 92,
      description: 'We are looking for a passionate Senior Frontend Developer to join our growing team...',
      tags: ['React', 'TypeScript', 'Node.js', 'AWS']
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $140k',
      posted: '1 day ago',
      match: 88,
      description: 'Join our innovative startup as a Full Stack Engineer and help build the future...',
      tags: ['JavaScript', 'Python', 'React', 'PostgreSQL']
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'DesignCo',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$80k - $110k',
      posted: '3 days ago',
      match: 76,
      description: 'We need a creative UI/UX Designer to design beautiful and intuitive user experiences...',
      tags: ['Figma', 'Adobe XD', 'Prototyping', 'User Research']
    }
  ];

  const sidebarFilters = [
    {
      title: 'Job Type',
      options: ['Full-time', 'Part-time', 'Contract', 'Freelance']
    },
    {
      title: 'Experience Level',
      options: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
    },
    {
      title: 'Remote',
      options: ['Remote', 'Hybrid', 'On-site']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 h-screen bg-zinc-900/50 backdrop-blur-sm border-r border-zinc-800 p-6 sticky top-0">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-100">Filters</h2>
            
            {/* Search */}
            <ReactiveInput
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

            {/* Location Filter */}
            <ReactiveInput
              placeholder="Location"
              value={selectedFilters.location}
              onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
            />

            {/* Filter Categories */}
            {sidebarFilters.map((filter, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-zinc-200 mb-3">{filter.title}</h3>
                <div className="space-y-2">
                  {filter.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-zinc-600 bg-zinc-800 text-primary focus:ring-primary"
                      />
                      <span className="text-zinc-300 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <ReactiveButton className="w-full">
              Apply Filters
            </ReactiveButton>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Job Recommendations</h1>
            <p className="text-zinc-300">Personalized job matches based on your profile</p>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <ReactiveButton variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Show Filters
            </ReactiveButton>
          </div>

          {/* Search Bar (Mobile) */}
          <div className="lg:hidden mb-6">
            <ReactiveInput
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Jobs Grid */}
          <div className="space-y-6">
            {jobs.map((job) => (
              <ReactiveCard key={job.id} className="hover:scale-[1.02] transition-transform duration-200">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-zinc-100 mb-1">
                          {job.title}
                        </h3>
                        <p className="text-primary font-medium">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-primary font-medium">{job.match}% match</span>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-300 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 lg:ml-6">
                    <ReactiveButton size="sm">
                      Apply Now
                    </ReactiveButton>
                    <ReactiveButton variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Details
                    </ReactiveButton>
                  </div>
                </div>
              </ReactiveCard>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <ReactiveButton variant="outline" size="lg">
              Load More Jobs
            </ReactiveButton>
          </div>
        </main>
      </div>
    </div>
  );
}