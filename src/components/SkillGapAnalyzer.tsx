import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SkillGapAnalysis {
  requiredSkills: string[];
  missingSkills: string[];
  skillGapScore: number;
  recommendations: string[];
  learningPath: string[];
}

export function SkillGapAnalyzer() {
  const [targetJob, setTargetJob] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeSkillGap = async () => {
    if (!targetJob.trim()) {
      toast({
        title: "Please enter a target job title",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const response = await supabase.functions.invoke('skill-gap-analyzer', {
        body: {
          currentSkills: profile?.skills || [],
          targetJobTitle: targetJob,
          targetJobDescription: jobDescription
        }
      });

      if (response.error) throw response.error;

      setAnalysis(response.data);

      // Save analysis to database
      await supabase
        .from('skill_gap_analysis')
        .insert({
          user_id: user.id,
          target_job_title: targetJob,
          current_skills: profile?.skills || [],
          required_skills: response.data.requiredSkills,
          missing_skills: response.data.missingSkills,
          skill_gap_score: response.data.skillGapScore,
          recommendations: response.data.recommendations
        });

      toast({
        title: "Skill gap analysis complete!",
        description: `Found ${response.data.missingSkills.length} skills to improve`,
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
      <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Target className="h-5 w-5" />
            Skill Gap Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Target Job Title</label>
              <Input
                placeholder="e.g., Senior React Developer"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Job Description (Optional)</label>
              <Input
                placeholder="Paste job requirements..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={analyzeSkillGap}
            disabled={analyzing}
            className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Skill Gap'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Score & Overview */}
          <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Skill Match Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {analysis.skillGapScore}/100
                </div>
                <Progress value={analysis.skillGapScore} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {analysis.skillGapScore >= 80 ? 'Excellent match!' : 
                   analysis.skillGapScore >= 60 ? 'Good match with room to grow' : 
                   'Significant skills gap to address'}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Skills You Have ({analysis.requiredSkills.length - analysis.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.requiredSkills.filter(skill => 
                      !analysis.missingSkills.includes(skill)
                    ).map((skill, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    Skills to Learn ({analysis.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.missingSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-orange-200 text-orange-700 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Path */}
          <Card className="bg-gradient-to-br from-background to-accent/5 border-accent/20 animate-slide-in-right" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <BookOpen className="h-5 w-5" />
                Learning Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-1 mb-2">
                  <Lightbulb className="h-4 w-4" />
                  Quick Wins
                </h4>
                <ul className="space-y-2 text-sm">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm flex items-center gap-1 mb-2">
                  <Target className="h-4 w-4" />
                  Learning Path
                </h4>
                <ul className="space-y-2 text-sm">
                  {analysis.learningPath.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                        {index + 1}
                      </div>
                      {step}
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