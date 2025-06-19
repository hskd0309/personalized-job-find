import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  MapPin, 
  Clock, 
  DollarSign,
  Briefcase,
  Plus,
  RefreshCw,
  Award
} from 'lucide-react';
import { allJobs, Job } from '@/data/jobs';

interface JobRecommendation extends Job {
  matchScore: number;
  reasons: string[];
  matchedSkills: string[];
}

export function JobRecommendationsPage() {
  const [matches, setMatches] = useState<JobRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (!newSkill.trim() || userSkills.includes(newSkill.trim())) return;
    setUserSkills([...userSkills, newSkill.trim()]);
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setUserSkills(userSkills.filter(skill => skill !== skillToRemove));
  };

  const generateNewMatches = async () => {
    if (userSkills.length === 0) {
      return;
    }

    setIsGenerating(true);
    try {
      // Generate recommendations from job search page data
      const jobsWithScores = allJobs.map(job => {
        const jobSkills = job.skills || [];
        const jobDescription = `${job.description} ${job.requirements?.join(' ') || ''}`.toLowerCase();
        
        // Find matching skills
        const matchedSkills = userSkills.filter(skill => {
          const skillLower = skill.toLowerCase();
          return jobSkills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skillLower) ||
            skillLower.includes(jobSkill.toLowerCase())
          ) || jobDescription.includes(skillLower);
        });
        
        // Calculate match score
        const matchScore = userSkills.length > 0 
          ? Math.round((matchedSkills.length / userSkills.length) * 100)
          : 0;

        // Generate match reasons
        const reasons = [];
        if (matchedSkills.length > 0) {
          reasons.push(`${matchedSkills.length} of your skills match this job`);
        }
        if (matchedSkills.length >= 3) {
          reasons.push('High skill compatibility');
        }
        if (matchedSkills.length >= userSkills.length * 0.7) {
          reasons.push('Excellent skill match');
        }

        return {
          ...job,
          matchScore,
          reasons,
          matchedSkills
        };
      });

      // Filter and sort recommendations
      const filteredRecommendations = jobsWithScores
        .filter(job => job.matchScore >= 20) // Show jobs with at least 20% match
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10); // Show top 10 recommendations

      setMatches(filteredRecommendations);
    } catch (error) {
      console.error('Error generating matches:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Recommendations
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized job recommendations based on your skills
          </p>
        </div>

        {/* Skills Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Skill */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g., React, Python, Project Management)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1"
              />
              <Button onClick={addSkill} disabled={!newSkill.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>

            {/* Skills Display */}
            {userSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No skills added yet. Add your skills to get personalized job recommendations.
              </p>
            )}

            {/* Generate Recommendations Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={generateNewMatches} 
                disabled={isGenerating || userSkills.length === 0}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Find Job Matches
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Recommendations Results */}
        {matches.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Found {matches.length} Job Matches
              </h2>
              <p className="text-gray-600">
                Jobs ranked by how well they match your skills
              </p>
            </div>

            {/* Job Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <Card key={match.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {match.title}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {match.company}
                        </p>
                      </div>
                      <Badge className={`${getMatchColor(match.matchScore)} font-semibold`}>
                        {match.matchScore}% Match
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {match.location}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        {match.type}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        {match.salary}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {match.description}
                    </p>

                    {/* Matched Skills */}
                    {match.matchedSkills && match.matchedSkills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-green-700 mb-2">Your Matching Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {match.matchedSkills.map((skill, index) => (
                            <Badge key={index} variant="default" className="text-xs bg-green-100 text-green-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Required Skills */}
                    {match.skills && match.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {match.skills.slice(0, 5).map((skill, index) => (
                            <Badge 
                              key={index} 
                              variant={match.matchedSkills?.includes(skill) ? "default" : "outline"}
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {match.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{match.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Match Reasons */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Why this matches:</p>
                      <ul className="space-y-1">
                        {match.reasons.map((reason, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Posted {match.postedDate}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {matches.length === 0 && userSkills.length > 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Job Matches Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find jobs matching your current skills. Try adding more skills or check back later.
              </p>
              <Button onClick={generateNewMatches} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Search Again
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}