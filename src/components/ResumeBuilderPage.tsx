import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Save,
  Upload,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    location: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    duration: string;
    location: string;
    details: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  awards: Array<{
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: 'Your Name',
    email: 'your.email@example.com',
    phone: '+1 (555) 123-4567',
    address: 'City, State, Country',
    linkedin: 'linkedin.com/in/yourprofile',
    github: 'github.com/yourusername'
  },
  summary: 'Professional summary highlighting your key achievements and career objectives.',
  experience: [
    {
      company: 'Company Name',
      position: 'Your Position',
      duration: 'Jan 2022 - Present',
      location: 'City, State',
      description: 'Key achievements and responsibilities in this role.'
    }
  ],
  education: [
    {
      institution: 'University Name',
      degree: 'Bachelor of Science in Computer Science',
      duration: '2018 - 2022',
      location: 'City, State',
      details: 'Relevant coursework, GPA, honors'
    }
  ],
  skills: [
    {
      category: 'Programming Languages',
      items: ['JavaScript', 'Python', 'Java', 'TypeScript']
    },
    {
      category: 'Frameworks & Libraries',
      items: ['React', 'Node.js', 'Express', 'Next.js']
    }
  ],
  projects: [
    {
      name: 'Project Name',
      description: 'Brief description of the project and its impact',
      technologies: 'React, Node.js, MongoDB',
      link: 'https://github.com/yourusername/project'
    }
  ],
  awards: [
    {
      title: 'Achievement Title',
      issuer: 'Issuing Organization',
      date: '2023',
      description: 'Description of the achievement'
    }
  ]
};

export function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'standard' | 'photo'>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedResumes();
  }, []);

  const loadSavedResumes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedResumes(data || []);
    } catch (error) {
      console.error('Error loading saved resumes:', error);
    }
  };

  const saveResume = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your resume",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: `Resume - ${resumeData.personalInfo.name}`,
          template_id: selectedTemplate,
          content: resumeData as any
        });

      if (error) throw error;

      toast({
        title: "Resume saved!",
        description: "Your resume has been saved successfully",
      });

      loadSavedResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error saving resume",
        variant: "destructive",
      });
    }
  };

  const generateLatexResume = async () => {
    setIsGenerating(true);
    try {
      // Call the edge function to generate LaTeX resume
      const { data, error } = await supabase.functions.invoke('generate-resume', {
        body: {
          resumeData,
          template: selectedTemplate
        }
      });

      if (error) throw error;

      if (data.pdf_url) {
        // Download the generated PDF
        window.open(data.pdf_url, '_blank');
        toast({
          title: "Resume generated!",
          description: "Your professional resume is ready for download",
        });
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Generation failed",
        description: "Unable to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        duration: '',
        location: '',
        description: ''
      }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        duration: '',
        location: '',
        details: ''
      }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkillCategory = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, {
        category: '',
        items: []
      }]
    }));
  };

  const updateSkillCategory = (index: number, category: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, category } : skill
      )
    }));
  };

  const updateSkillItems = (index: number, itemsStr: string) => {
    const items = itemsStr.split(',').map(item => item.trim()).filter(Boolean);
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, items } : skill
      )
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Professional Resume Builder
          </h1>
          <p className="text-muted-foreground">Create a professional LaTeX-based resume</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveResume} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Resume
          </Button>
          <Button 
            onClick={generateLatexResume} 
            disabled={isGenerating}
            className="bg-primary hover:bg-primary/90"
          >
            {isGenerating ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Generate PDF
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Template Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedTemplate === 'standard' ? 'border-primary bg-primary/5' : 'border-muted'
              }`}
              onClick={() => setSelectedTemplate('standard')}
            >
              <div className="font-semibold">Standard Resume</div>
              <div className="text-sm text-muted-foreground">Clean professional layout</div>
            </div>
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedTemplate === 'photo' ? 'border-primary bg-primary/5' : 'border-muted'
              }`}
              onClick={() => setSelectedTemplate('photo')}
            >
              <div className="font-semibold">Photo Resume</div>
              <div className="text-sm text-muted-foreground">Includes photo section</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Form */}
        <div className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal" className="text-xs">
                <User className="h-4 w-4 mr-1" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-xs">
                <Briefcase className="h-4 w-4 mr-1" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs">
                <GraduationCap className="h-4 w-4 mr-1" />
                Education
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">
                <Award className="h-4 w-4 mr-1" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs">
                <FileText className="h-4 w-4 mr-1" />
                Projects
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => updatePersonalInfo('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={resumeData.personalInfo.address}
                        onChange={(e) => updatePersonalInfo('address', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={resumeData.personalInfo.github}
                        onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      rows={4}
                      value={resumeData.summary}
                      onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience */}
            <TabsContent value="experience">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Work Experience</CardTitle>
                  <Button onClick={addExperience} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateExperience(index, 'position', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={exp.duration}
                            onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                            placeholder="Jan 2022 - Present"
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(index, 'location', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education */}
            <TabsContent value="education">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button onClick={addEducation} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={edu.duration}
                            onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                            placeholder="2018 - 2022"
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(index, 'location', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Details</Label>
                        <Textarea
                          value={edu.details}
                          onChange={(e) => updateEducation(index, 'details', e.target.value)}
                          rows={2}
                          placeholder="GPA, honors, relevant coursework"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Skills</CardTitle>
                  <Button onClick={addSkillCategory} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.skills.map((skillGroup, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={skillGroup.category}
                          onChange={(e) => updateSkillCategory(index, e.target.value)}
                          placeholder="e.g., Programming Languages"
                        />
                      </div>
                      <div>
                        <Label>Skills (comma-separated)</Label>
                        <Input
                          value={skillGroup.items.join(', ')}
                          onChange={(e) => updateSkillItems(index, e.target.value)}
                          placeholder="JavaScript, Python, React, Node.js"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects */}
            <TabsContent value="projects">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Projects</CardTitle>
                  <Button 
                    onClick={() => setResumeData(prev => ({
                      ...prev,
                      projects: [...prev.projects, {
                        name: '',
                        description: '',
                        technologies: '',
                        link: ''
                      }]
                    }))}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Project Name</Label>
                          <Input
                            value={project.name}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              projects: prev.projects.map((p, i) => 
                                i === index ? { ...p, name: e.target.value } : p
                              )
                            }))}
                          />
                        </div>
                        <div>
                          <Label>Technologies</Label>
                          <Input
                            value={project.technologies}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              projects: prev.projects.map((p, i) => 
                                i === index ? { ...p, technologies: e.target.value } : p
                              )
                            }))}
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            projects: prev.projects.map((p, i) => 
                              i === index ? { ...p, description: e.target.value } : p
                            )
                          }))}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Link (optional)</Label>
                        <Input
                          value={project.link}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            projects: prev.projects.map((p, i) => 
                              i === index ? { ...p, link: e.target.value } : p
                            )
                          }))}
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview & Saved Resumes */}
        <div className="space-y-6">
          {/* Resume Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Resume Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-6 border rounded-lg text-black min-h-[400px] text-sm">
                <div className="text-center border-b pb-4 mb-4">
                  <h1 className="text-2xl font-bold">{resumeData.personalInfo.name}</h1>
                  <div className="text-gray-600 mt-2">
                    <div>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</div>
                    <div>{resumeData.personalInfo.address}</div>
                    <div>{resumeData.personalInfo.linkedin} | {resumeData.personalInfo.github}</div>
                  </div>
                </div>
                
                {resumeData.summary && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold border-b mb-2">SUMMARY</h2>
                    <p className="text-gray-700">{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.experience.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold border-b mb-2">EXPERIENCE</h2>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between">
                          <strong>{exp.position}</strong>
                          <span className="text-gray-600">{exp.duration}</span>
                        </div>
                        <div className="text-gray-600">{exp.company} | {exp.location}</div>
                        <p className="text-gray-700 mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.education.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold border-b mb-2">EDUCATION</h2>
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between">
                          <strong>{edu.degree}</strong>
                          <span className="text-gray-600">{edu.duration}</span>
                        </div>
                        <div className="text-gray-600">{edu.institution} | {edu.location}</div>
                        {edu.details && <p className="text-gray-700 text-sm">{edu.details}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.skills.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold border-b mb-2">SKILLS</h2>
                    {resumeData.skills.map((skillGroup, index) => (
                      <div key={index} className="mb-2">
                        <strong>{skillGroup.category}:</strong> {skillGroup.items.join(', ')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Saved Resumes */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Resumes</CardTitle>
            </CardHeader>
            <CardContent>
              {savedResumes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No saved resumes yet</p>
              ) : (
                <div className="space-y-2">
                  {savedResumes.map((resume) => (
                    <div key={resume.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{resume.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(resume.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setResumeData(resume.content)}
                      >
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}