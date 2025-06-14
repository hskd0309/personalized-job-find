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
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <Brain className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          AI Resume Analyzer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get comprehensive AI-powered feedback on your resume. Improve your chances of landing your dream job.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload & Analyze Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Resume (PDF)
                </label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Or paste your resume text
                </label>
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={12}
                  className="min-h-[300px]"
                />
              </div>

              <Button
                onClick={analyzeResume}
                disabled={isAnalyzing || !resumeText.trim()}
                className="w-full bg-black hover:bg-gray-600 text-white"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysis ? (
            <>
              {/* Overall Score */}
              <Card className="bg-gradient-to-br from-background to-secondary/5 border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                     <div className={`text-4xl font-bold ${getScoreColor(analysis.score || analysis.overallScore)}`}>
                       {analysis.score || analysis.overallScore}/100
                     </div>
                     <Progress 
                       value={analysis.score || analysis.overallScore} 
                       className="h-3"
                     />
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Scores */}
              <Card className="bg-gradient-to-br from-background to-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Detailed Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Grammar & Writing', score: analysis.grammarScore },
                    { label: 'Formatting', score: analysis.formattingScore },
                    { label: 'Keywords', score: analysis.keywordScore },
                    { label: 'ATS Friendly', score: analysis.atsScore }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.label}</span>
                        <div className="flex items-center gap-2">
                          {getScoreIcon(item.score)}
                          <span className={`font-bold ${getScoreColor(item.score)}`}>
                            {item.score}%
                          </span>
                        </div>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Improvements */}
              <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <div key={index} className="p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                        <p className="text-sm">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Summary */}
              <Card className="bg-gradient-to-br from-background to-secondary/5 border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Skills Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Extracted Skills ({analysis.extractedSkills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.extractedSkills?.map((skill, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                          {skill}
                        </Badge>
                      )) || <p className="text-sm text-muted-foreground">No skills detected</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Experience: {analysis.experienceYears || 0} years
                    </h4>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <Target className="h-4 w-4 text-orange-600" />
                      Skills to Add ({analysis.missingSkills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.missingSkills?.map((skill, index) => (
                        <Badge key={index} variant="outline" className="border-orange-200 text-orange-700 text-xs">
                          {skill}
                        </Badge>
                      )) || <p className="text-sm text-muted-foreground">All essential skills covered</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Weaknesses */}
              <Card className="bg-gradient-to-br from-background to-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Strengths & Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.strengths && analysis.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h4>
                      <div className="space-y-1">
                        {analysis.strengths.map((strength, index) => (
                          <div key={index} className="p-2 bg-green-50 rounded-lg border-l-4 border-green-400">
                            <p className="text-sm text-green-700">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        Areas to Improve
                      </h4>
                      <div className="space-y-1">
                        {analysis.weaknesses.map((weakness, index) => (
                          <div key={index} className="p-2 bg-red-50 rounded-lg border-l-4 border-red-400">
                            <p className="text-sm text-red-700">{weakness}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ATS Tips */}
              {analysis.atsStrategies && analysis.atsStrategies.length > 0 && (
                <Card className="bg-gradient-to-br from-background to-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Brain className="h-5 w-5" />
                      ATS Optimization Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.atsStrategies.map((tip, index) => (
                        <div key={index} className="p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm text-blue-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Industry Tips */}
              {analysis.industryTips && analysis.industryTips.length > 0 && (
                <Card className="bg-gradient-to-br from-background to-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <BookOpen className="h-5 w-5" />
                      Industry Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.industryTips.map((tip, index) => (
                        <div key={index} className="p-2 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                          <p className="text-sm text-purple-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Template Recommendations - Show when score < 90 */}
              {(analysis.score || analysis.overallScore) < 90 && (
                <Card className="bg-gradient-to-br from-background to-amber-50 border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700">
                      <Layout className="h-5 w-5" />
                      Recommended Templates
                    </CardTitle>
                    <p className="text-sm text-amber-600 mt-1">
                      Consider using these professional templates to improve your resume's impact
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {resumeTemplates.slice(0, 4).map((template) => (
                        <div key={template.id} className="p-3 bg-white rounded-lg border border-amber-200 hover:border-amber-300 transition-colors">
                          <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-md mb-2 flex items-center justify-center">
                            <Layout className="h-8 w-8 text-gray-400" />
                          </div>
                          <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{template.category}</p>
                          <Button size="sm" variant="outline" className="w-full text-xs">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Use Template
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                      <p className="text-sm text-amber-800">
                        💡 <strong>Pro Tip:</strong> Professional templates can boost your resume score by 15-20 points through better formatting and ATS optimization.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-gradient-to-br from-background to-muted/5">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Upload or paste your resume to get AI-powered analysis and recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}