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
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResumeAnalysis {
  overallScore: number;
  grammarScore: number;
  formattingScore: number;
  keywordScore: number;
  atsScore: number;
  improvements: string[];
  missingSkills: string[];
  feedback: string;
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
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
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
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}/100
                    </div>
                    <Progress 
                      value={analysis.overallScore} 
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

              {/* Missing Skills */}
              <Card className="bg-gradient-to-br from-background to-secondary/5 border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Suggested Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
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