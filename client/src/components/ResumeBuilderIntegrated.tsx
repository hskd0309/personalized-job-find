import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, FileText, User, Briefcase, GraduationCap, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export function ResumeBuilderIntegrated() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('personal');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({});
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const downloadResume = async () => {
    try {
      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) {
        toast({
          title: "Error",
          description: "Resume preview not found. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create canvas from the resume element
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${resumeData.personalInfo.firstName || 'Resume'}_${resumeData.personalInfo.lastName || 'Document'}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Resume Downloaded",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addExperience = () => {
    if (newExperience.position && newExperience.company) {
      const experience: Experience = {
        id: Date.now().toString(),
        position: newExperience.position || '',
        company: newExperience.company || '',
        location: newExperience.location || '',
        startDate: newExperience.startDate || '',
        endDate: newExperience.endDate || '',
        description: newExperience.description || '',
        current: newExperience.current || false
      };
      setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, experience]
      }));
      setNewExperience({});
    }
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      const education: Education = {
        id: Date.now().toString(),
        degree: newEducation.degree || '',
        institution: newEducation.institution || '',
        location: newEducation.location || '',
        graduationDate: newEducation.graduationDate || '',
        gpa: newEducation.gpa
      };
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, education]
      }));
      setNewEducation({});
    }
  };

  const generateResume = async () => {
    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          templateId: 'professional'
        }),
      });

      if (!response.ok) throw new Error('Failed to generate resume');

      const data = await response.json();
      
      // Create and download the resume
      const blob = new Blob([data.resumeHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume Generated!",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 orientation-landscape:px-6 orientation-portrait:px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Resume Builder</h1>
          <p className="text-muted-foreground">Create your professional resume with our integrated builder</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {section.label}
                    </Button>
                  );
                })}
                <Button 
                  onClick={downloadResume}
                  className="w-full mt-4"
                  disabled={!resumeData.personalInfo.firstName}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {sections.find(s => s.id === activeSection)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSection === 'personal' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <Input
                          value={resumeData.personalInfo.firstName}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                          }))}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <Input
                          value={resumeData.personalInfo.lastName}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                          }))}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <Input
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          value={resumeData.personalInfo.location}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, location: e.target.value }
                          }))}
                          placeholder="New York, NY"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Professional Summary</label>
                      <Textarea
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, summary: e.target.value }
                        }))}
                        placeholder="Brief summary of your professional background and goals..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-6">
                    {/* Add New Experience */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold">Add Experience</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Position"
                          value={newExperience.position || ''}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, position: e.target.value }))}
                        />
                        <Input
                          placeholder="Company"
                          value={newExperience.company || ''}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          placeholder="Location"
                          value={newExperience.location || ''}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                        />
                        <Input
                          type="date"
                          placeholder="Start Date"
                          value={newExperience.startDate || ''}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                        <Input
                          type="date"
                          placeholder="End Date"
                          value={newExperience.endDate || ''}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
                          disabled={newExperience.current}
                        />
                      </div>
                      <Textarea
                        placeholder="Job description and achievements..."
                        value={newExperience.description || ''}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="current"
                          checked={newExperience.current || false}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, current: e.target.checked }))}
                        />
                        <label htmlFor="current" className="text-sm">Current position</label>
                      </div>
                      <Button onClick={addExperience}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>

                    {/* Experience List */}
                    <div className="space-y-4">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{exp.position}</h4>
                              <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                              <p className="text-sm text-muted-foreground">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </p>
                              <p className="mt-2">{exp.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="space-y-6">
                    {/* Add New Education */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold">Add Education</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Degree"
                          value={newEducation.degree || ''}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                        />
                        <Input
                          placeholder="Institution"
                          value={newEducation.institution || ''}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          placeholder="Location"
                          value={newEducation.location || ''}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, location: e.target.value }))}
                        />
                        <Input
                          type="date"
                          placeholder="Graduation Date"
                          value={newEducation.graduationDate || ''}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, graduationDate: e.target.value }))}
                        />
                        <Input
                          placeholder="GPA (Optional)"
                          value={newEducation.gpa || ''}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, gpa: e.target.value }))}
                        />
                      </div>
                      <Button onClick={addEducation}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>

                    {/* Education List */}
                    <div className="space-y-4">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-muted-foreground">{edu.institution} • {edu.location}</p>
                          <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
                          {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="space-y-6">
                    {/* Add New Skill */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button onClick={addSkill}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Skills List */}
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                    {resumeData.skills.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        No skills added yet. Add your first skill above.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resume Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div id="resume-preview" className="bg-white p-4 border rounded-lg min-h-[600px] text-black">
                  {/* Header */}
                  <div className="text-center border-b pb-4 mb-4">
                    <h1 className="text-xl font-bold">
                      {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                    </h1>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      {resumeData.personalInfo.email && <p>{resumeData.personalInfo.email}</p>}
                      {resumeData.personalInfo.phone && <p>{resumeData.personalInfo.phone}</p>}
                      {resumeData.personalInfo.location && <p>{resumeData.personalInfo.location}</p>}
                    </div>
                  </div>

                  {/* Summary */}
                  {resumeData.personalInfo.summary && (
                    <div className="mb-4">
                      <h2 className="text-sm font-bold mb-2 border-b">SUMMARY</h2>
                      <p className="text-xs text-gray-700">{resumeData.personalInfo.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.length > 0 && (
                    <div className="mb-4">
                      <h2 className="text-sm font-bold mb-2 border-b">EXPERIENCE</h2>
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="mb-3">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs font-semibold">{exp.position}</h3>
                            <span className="text-xs text-gray-600">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{exp.company} • {exp.location}</p>
                          <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {resumeData.education.length > 0 && (
                    <div className="mb-4">
                      <h2 className="text-sm font-bold mb-2 border-b">EDUCATION</h2>
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="mb-2">
                          <h3 className="text-xs font-semibold">{edu.degree}</h3>
                          <p className="text-xs text-gray-600">{edu.institution} • {edu.location}</p>
                          <p className="text-xs text-gray-600">{edu.graduationDate}</p>
                          {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills.length > 0 && (
                    <div className="mb-4">
                      <h2 className="text-sm font-bold mb-2 border-b">SKILLS</h2>
                      <div className="flex flex-wrap gap-1">
                        {resumeData.skills.map((skill, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}