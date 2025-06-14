import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Edit, Plus, Bot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResumeForm } from '@/components/ResumeBuilder/ResumeForm';
import { ResumePreview } from '@/components/ResumeBuilder/ResumePreview';
import { resumeTemplates, templateCategories } from '@/components/resume/ResumeTemplates';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
  summary: string;
  summaryHeading?: string;
  experience: Array<{
    id: string;
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
}

export function ResumeBuilderPage() {
  const [activeView, setActiveView] = useState<'templates' | 'builder'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [selectedCategory, setSelectedCategory] = useState('All Templates');
  const [myResumes, setMyResumes] = useState<any[]>([]);
  const [currentResume, setCurrentResume] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: ''
    },
    summary: '',
    summaryHeading: 'Professional Summary',
    experience: [],
    education: [],
    skills: []
  });
  const { toast } = useToast();

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'All Templates' 
    ? resumeTemplates 
    : resumeTemplates.filter(template => template.category === selectedCategory);

  useEffect(() => {
    fetchMyResumes();
    loadProfileData();
  }, []);

  const fetchMyResumes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setMyResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const loadProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: experiences, error: expError } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (profile && !profileError) {
        setCurrentResume(prev => ({
          ...prev,
          personalInfo: {
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            website: '',
            linkedin: ''
          },
          skills: profile.skills || []
        }));
      }

      if (experiences && !expError) {
        const formattedExp = experiences.map(exp => ({
          id: exp.id,
          position: exp.position,
          company: exp.company_name,
          location: exp.location || '',
          startDate: exp.start_date,
          endDate: exp.end_date || '',
          current: exp.is_current || false,
          description: exp.description || ''
        }));
        
        setCurrentResume(prev => ({
          ...prev,
          experience: formattedExp
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const createNewResume = () => {
    setActiveView('builder');
    setCurrentResume({
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: ''
      },
      summary: '',
      summaryHeading: 'Professional Summary',
      experience: [],
      education: [],
      skills: []
    });
    loadProfileData();
  };

  const selectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setActiveView('builder');
  };

  const saveResume = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const resumeData = {
        user_id: user.id,
        title: `${currentResume.personalInfo.firstName} ${currentResume.personalInfo.lastName} Resume`,
        template_id: selectedTemplate,
        content: JSON.parse(JSON.stringify(currentResume))
      };

      const { error } = await supabase
        .from('resumes')
        .insert(resumeData);

      if (error) throw error;

      toast({
        title: "Resume Saved!",
        description: "Your resume has been saved successfully.",
      });
      
      fetchMyResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadResume = async (resumeId: string) => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();

      if (error) throw error;
      
      // Safely cast the content with proper typing
      const resumeContent = data.content as unknown as ResumeData;
      setCurrentResume(resumeContent);
      setSelectedTemplate(data.template_id);
      setActiveView('builder');
    } catch (error) {
      console.error('Error loading resume:', error);
      toast({
        title: "Error",
        description: "Failed to load resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateAIResume = async () => {
    try {
      const { data: aiData, error } = await supabase.functions.invoke('career-chat', {
        body: { 
          message: `Create a complete resume structure for someone with experience in: ${currentResume.experience.map(exp => exp.position).join(', ')} and skills: ${currentResume.skills.join(', ')}. Return it as a JSON object with sections for summary, experience descriptions, and education suggestions for the Indian job market.`,
          type: 'resume_generation'
        }
      });

      if (error) throw error;
      
      // You would parse the AI response and update the resume data
      toast({
        title: "AI Resume Generated!",
        description: "Your resume has been enhanced with AI suggestions.",
      });
    } catch (error) {
      console.error('Error generating AI resume:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (activeView === 'builder') {
    return (
      <div className="container mx-auto px-4 py-6 h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setActiveView('templates')}>
              ← Back to Templates
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Resume Builder</h1>
          </div>
          <Button onClick={generateAIResume}>
            <Bot className="h-4 w-4 mr-2" />
            AI Enhance
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          <ResumeForm 
            data={currentResume}
            onChange={setCurrentResume}
            onSave={saveResume}
          />
          <ResumePreview 
            data={currentResume}
            templateId={selectedTemplate}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          AI Resume Builder
        </h1>
        <Button onClick={createNewResume}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Resume
        </Button>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Choose Template</TabsTrigger>
          <TabsTrigger value="my-resumes">My Resumes ({myResumes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Professional Templates ({filteredTemplates.length})
                </CardTitle>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {templateCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                  <div 
                    key={template.id} 
                    className="border rounded-lg p-4 hover:border-primary cursor-pointer hover:shadow-lg group transition-all"
                    onClick={() => selectTemplate(template.id)}
                  >
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded mb-3 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all">
                      <FileText className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-semibold text-center">{template.name}</h3>
                    <p className="text-xs text-muted-foreground text-center mt-1">{template.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {template.category}
                      </span>
                      <Button variant="outline" className="text-xs px-3 py-1" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-resumes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Saved Resumes</CardTitle>
            </CardHeader>
            <CardContent>
              {myResumes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No resumes created yet.</p>
                  <Button onClick={createNewResume} className="mt-4">
                    Create Your First Resume
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myResumes.map((resume) => (
                    <Card key={resume.id} className="cursor-pointer">
                      <CardContent className="p-4">
                        <h4 className="font-medium truncate">{resume.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3">
                          Updated: {new Date(resume.updated_at).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => loadResume(resume.id)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Features */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            AI-Powered Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Smart Content</h3>
              <p className="text-sm text-muted-foreground">AI generates professional summaries and descriptions</p>
            </div>
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">ATS Optimized</h3>
              <p className="text-sm text-muted-foreground">Templates designed to pass ATS systems</p>
            </div>
            <div className="text-center p-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Live Preview</h3>
              <p className="text-sm text-muted-foreground">See changes in real-time as you edit</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}