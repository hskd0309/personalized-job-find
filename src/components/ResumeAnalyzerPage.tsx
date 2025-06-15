import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Star, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Target,
  Brain,
  Zap,
  Layout,
  Award,
  BookOpen,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { resumeTemplates } from '@/components/resume/ResumeTemplates';

interface ResumeAnalysis {
  score: number;
  overallScore: number;
  grammarScore: number;
  formattingScore: number;
  keywordScore: number;
  atsScore: number;
  improvements: string[];
  missingSkills: string[];
  feedback: string;
  extractedSkills: string[];
  experienceYears: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  atsStrategies: string[];
  industryTips: string[];
}

export function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // For demo purposes, we'll use text input
      // In production, you'd implement PDF parsing here
      toast({
        title: "File uploaded",
        description: "Please paste your resume text below for analysis.",
      });
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume text required",
        description: "Please enter your resume text to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user profile for skills context
      const { data: profile } = await supabase
        .from('profiles')
        .select('skills')
        .eq('user_id', user.id)
        .single();

      const response = await supabase.functions.invoke('resume-analyzer', {
        body: {
          resumeText: resumeText,
          skills: profile?.skills || [],
          experience: 'Not specified'
        }
      });

      if (response.error) throw response.error;

      setAnalysis(response.data);
      
      // Save analysis to database
      await supabase.from('resume_uploads').upsert({
        user_id: user.id,
        file_name: file?.name || 'text_input.txt',
        file_url: 'text_input',
        file_size: resumeText.length,
        parsed_data: { text: resumeText },
        ai_score: response.data.overallScore,
        ai_feedback: response.data.feedback,
        skills_extracted: response.data.missingSkills
      });

      toast({
        title: "Analysis complete!",
        description: `Your resume scored ${response.data.overallScore}/100`,
      });

    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-zinc-100">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Get comprehensive AI-powered feedback on your resume. Improve your chances of landing your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
              <div className="flex items-center gap-2 text-zinc-100 mb-4">
                <Upload className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Upload & Analyze Resume</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">
                    Upload Resume (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-zinc-700 file:text-zinc-300 hover:file:bg-zinc-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">
                    Or paste your resume text
                  </label>
                  <textarea
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={12}
                    className="w-full min-h-[300px] px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  onClick={analyzeResume}
                  disabled={isAnalyzing || !resumeText.trim()}
                  className="w-full px-4 py-3 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 inline" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2 inline" />
                      Analyze Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Overall Score */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
                  <div className="flex items-center gap-2 text-zinc-100 mb-4">
                    <Star className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Overall Score</h2>
                  </div>
                  <div className="text-center space-y-4">
                     <div className={`text-4xl font-bold ${getScoreColor(analysis.score || analysis.overallScore)}`}>
                       {analysis.score || analysis.overallScore}/100
                     </div>
                     <div className="bg-zinc-800 rounded-lg h-3">
                       <div 
                         className="bg-emerald-400 h-3 rounded-lg transition-all duration-300" 
                         style={{ width: `${analysis.score || analysis.overallScore}%` }}
                       />
                     </div>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
                  <div className="flex items-center gap-2 text-zinc-100 mb-4">
                    <TrendingUp className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Detailed Analysis</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Grammar & Writing', score: analysis.grammarScore },
                      { label: 'Formatting', score: analysis.formattingScore },
                      { label: 'Keywords', score: analysis.keywordScore },
                      { label: 'ATS Friendly', score: analysis.atsScore }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-zinc-300">{item.label}</span>
                          <div className="flex items-center gap-2">
                            {getScoreIcon(item.score)}
                            <span className={`font-bold ${getScoreColor(item.score)}`}>
                              {item.score}%
                            </span>
                          </div>
                        </div>
                        <div className="bg-zinc-800 rounded-lg h-2">
                          <div 
                            className={`h-2 rounded-lg transition-all duration-300 ${
                              item.score >= 80 ? 'bg-emerald-400' : 
                              item.score >= 60 ? 'bg-yellow-400' : 
                              'bg-red-400'
                            }`} 
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
                  <div className="flex items-center gap-2 text-zinc-100 mb-4">
                    <Target className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Improvements</h2>
                  </div>
                  <div className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <div key={index} className="p-3 bg-emerald-600/20 rounded-lg border-l-4 border-emerald-400">
                        <p className="text-sm text-zinc-200">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Summary */}
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
                  <div className="flex items-center gap-2 text-zinc-100 mb-4">
                    <Award className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Skills Analysis</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        Extracted Skills ({analysis.extractedSkills?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.extractedSkills?.map((skill, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-emerald-600 text-zinc-100 rounded-lg">
                            {skill}
                          </span>
                        )) || <p className="text-sm text-zinc-400">No skills detected</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 text-blue-400">
                        <Clock className="h-4 w-4" />
                        Experience: {analysis.experienceYears || 0} years
                      </h4>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 text-orange-400">
                        <Target className="h-4 w-4" />
                        Skills to Add ({analysis.missingSkills?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.missingSkills?.map((skill, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-zinc-800 text-orange-400 rounded-lg border border-orange-500">
                            {skill}
                          </span>
                        )) || <p className="text-sm text-zinc-400">All essential skills covered</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-8 text-center">
                <FileText className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
                <p className="text-zinc-400">
                  Upload or paste your resume to get AI-powered analysis and recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}