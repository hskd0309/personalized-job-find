import { useState } from 'react';
import { Search, Filter, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface JobSearchProps {
  onSearch: (filters: SearchFilters) => void;
  totalJobs: number;
}

export interface SearchFilters {
  searchTerm: string;
  location: string;
  jobType: string;
  experience: string;
  salary: string;
  category: string;
}

export function JobSearch({ onSearch, totalJobs }: JobSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    location: '',
    jobType: '',
    experience: '',
    salary: '',
    category: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {
      searchTerm: '',
      location: '',
      jobType: '',
      experience: '',
      salary: '',
      category: ''
    };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Card>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Main Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies..."
                className="pl-10 text-sm sm:text-base"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
            <div className="relative flex-1 sm:flex-none">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location"
                className="pl-10 text-sm sm:text-base sm:w-48"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="relative min-h-[44px] w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <Select value={filters.jobType} onValueChange={(value) => handleFilterChange('jobType', value)}>
                <SelectTrigger>
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.experience} onValueChange={(value) => handleFilterChange('experience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.salary} onValueChange={(value) => handleFilterChange('salary', value)}>
                <SelectTrigger>
                  <DollarSign className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Salary Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Salary</SelectItem>
                  <SelectItem value="4-8">₹4L - ₹8L</SelectItem>
                  <SelectItem value="8-15">₹8L - ₹15L</SelectItem>
                  <SelectItem value="15-25">₹15L - ₹25L</SelectItem>
                  <SelectItem value="25+">₹25L+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="New">New (Posted by Companies)</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Results Summary and Clear Filters */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {totalJobs} jobs found
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}