import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  score: number;
  feedback: string;
  extractedSkills: string[];
  experienceYears: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const analyzeResume = async () => {
    if (!file) return;

    setAnalyzing(true);
    try {
      // Get user profile for context
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // For demo purposes, we'll use file name as text content
      // In production, you'd extract text from PDF
      const resumeText = `Resume for ${profile?.first_name} ${profile?.last_name}
        Skills: ${profile?.skills?.join(', ') || 'No skills listed'}
        Experience: ${JSON.stringify(profile?.experience || [])}
        Location: ${profile?.location}
        Email: ${profile?.email}`;

      const response = await supabase.functions.invoke('resume-analyzer', {
        body: {
          resumeText,
          skills: profile?.skills || [],
          experience: profile?.experience || []
        }
      });

      if (response.error) throw response.error;

      setAnalysis(response.data);

      // Save analysis to database
      await supabase
        .from('resume_uploads')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: `temp://${file.name}`,
          file_size: file.size,
          parsed_data: response.data,
          ai_score: response.data.score,
          ai_feedback: response.data.feedback,
          skills_extracted: response.data.extractedSkills,
          experience_years: response.data.experienceYears
        });

      toast({
        title: "Resume analyzed successfully!",
        description: `Your resume scored ${response.data.score}/100`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <FileText className="h-5 w-5" />
            AI Resume Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 p-4 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/50 transition-colors bg-background/50">
                <Upload className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {file ? file.name : 'Upload PDF Resume'}
                </span>
              </div>
            </label>
            <Button 
              onClick={analyzeResume} 
              disabled={!file || analyzing}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Score Card */}
          <Card className="bg-gradient-to-br from-background to-accent/5 border-accent/20 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Star className="h-5 w-5" />
                Resume Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {analysis.score}/100
                </div>
                <Progress value={analysis.score} className="mt-2" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Strengths</h4>
                <div className="flex flex-wrap gap-1">
                  {analysis.strengths.map((strength, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Areas for Improvement</h4>
                <div className="flex flex-wrap gap-1">
                  {analysis.weaknesses.map((weakness, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Suggestions */}
          <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20 animate-slide-in-right" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Extracted Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {analysis.extractedSkills.map((skill, index) => (
                  <Badge key={index} className="bg-primary/10 text-primary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Improvement Suggestions
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}