import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, FileText, User, Briefcase, GraduationCap, Award, Edit3, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  title: string;
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

interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

interface CustomItem {
  id: string;
  title: string;
  content: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  customSections: CustomSection[];
}

export function ResumeBuilderPage() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('personal');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      title: ''
    },
    experience: [],
    education: [],
    skills: [],
    customSections: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({});
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});
  const [newCustomSection, setNewCustomSection] = useState('');
  const [newCustomItem, setNewCustomItem] = useState<{[key: string]: {title: string, content: string}}>({});

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

  const addCustomSection = () => {
    if (newCustomSection.trim()) {
      const section: CustomSection = {
        id: Date.now().toString(),
        title: newCustomSection.trim(),
        items: []
      };
      setResumeData(prev => ({
        ...prev,
        customSections: [...prev.customSections, section]
      }));
      setNewCustomSection('');
    }
  };

  const addCustomItem = (sectionId: string) => {
    const itemData = newCustomItem[sectionId];
    if (itemData?.title && itemData?.content) {
      const item: CustomItem = {
        id: Date.now().toString(),
        title: itemData.title,
        content: itemData.content
      };
      setResumeData(prev => ({
        ...prev,
        customSections: prev.customSections.map(section =>
          section.id === sectionId
            ? { ...section, items: [...section.items, item] }
            : section
        )
      }));
      setNewCustomItem(prev => ({ ...prev, [sectionId]: { title: '', content: '' } }));
    }
  };

  const deleteCustomSection = (sectionId: string) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== sectionId)
    }));
  };

  const generateResume = () => {
    toast({
      title: "Resume Generated!",
      description: "Your professional resume is ready for download.",
    });
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'custom', label: 'Custom Sections', icon: Edit3 },
    { id: 'preview', label: 'Preview', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Professional Resume Builder
          </h1>
          <p className="text-muted-foreground">Create a stunning resume with custom sections and professional formatting</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Sections
                </CardTitle>
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
                <div className="pt-4 border-t">
                  <Button 
                    onClick={generateResume}
                    className="w-full"
                    disabled={!resumeData.personalInfo.firstName}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {sections.find(s => s.id === activeSection)?.icon && (
                    <div className="p-2 rounded-lg bg-primary/10">
                      {(() => {
                        const Icon = sections.find(s => s.id === activeSection)?.icon;
                        return Icon ? <Icon className="h-5 w-5 text-primary" /> : null;
                      })()}
                    </div>
                  )}
                  {sections.find(s => s.id === activeSection)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeSection === 'personal' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Professional Title</label>
                      <Input
                        value={resumeData.personalInfo.title}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, title: e.target.value }
                        }))}
                        placeholder="Software Engineer, Marketing Manager, etc."
                        className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <Input
                          value={resumeData.personalInfo.firstName}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                          }))}
                          placeholder="John"
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
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
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <Input
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))}
                          placeholder="+1 (555) 123-4567"
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                      </div>
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
                        className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                      />
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
                        className="border-2 border-primary/20"
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-lg">Add Work Experience</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Job Title"
                          value={newExperience.position || ''}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, position: e.target.value }))}
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                        <Input
                          placeholder="Company Name"
                          value={newExperience.company || ''}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Location"
                          value={newExperience.location || ''}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
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
                        placeholder="Describe your responsibilities and achievements..."
                        value={newExperience.description || ''}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="border-2 border-primary/20"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="current"
                          checked={newExperience.current || false}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, current: e.target.checked }))}
                          className="rounded border-primary"
                        />
                        <label htmlFor="current" className="text-sm font-medium">Currently working here</label>
                      </div>
                      <Button onClick={addExperience} className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="border border-border rounded-lg p-4 bg-card">
                          <div className="border-b border-primary/20 pb-2 mb-2">
                            <h4 className="font-semibold text-lg">{exp.position}</h4>
                            <p className="text-primary font-medium">{exp.company} • {exp.location}</p>
                            <p className="text-sm text-muted-foreground">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                          </div>
                          <p className="text-sm leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-lg">Add Education</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Degree & Major"
                          value={newEducation.degree || ''}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                        <Input
                          placeholder="Institution Name"
                          value={newEducation.institution || ''}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Location"
                          value={newEducation.location || ''}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, location: e.target.value }))}
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
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
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                      </div>
                      <Button onClick={addEducation} className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="border border-border rounded-lg p-4 bg-card">
                          <div className="border-b border-primary/20 pb-2 mb-2">
                            <h4 className="font-semibold text-lg">{edu.degree}</h4>
                            <p className="text-primary font-medium">{edu.institution} • {edu.location}</p>
                            <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
                          </div>
                          {edu.gpa && <p className="text-sm font-medium">GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Add Skills</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., JavaScript, Project Management, Adobe Photoshop..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                        <Button onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold border-b border-primary/20 pb-2">Your Skills</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {resumeData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/20 transition-colors justify-between p-2"
                            onClick={() => removeSkill(skill)}
                          >
                            <span>{skill}</span>
                            <span className="ml-2 opacity-60">×</span>
                          </Badge>
                        ))}
                      </div>
                      {resumeData.skills.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Award className="h-12 w-12 mx-auto mb-2 opacity-30" />
                          <p>No skills added yet. Add your first skill above.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeSection === 'custom' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Create Custom Section</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Section name (e.g., Certifications, Projects, Languages...)"
                          value={newCustomSection}
                          onChange={(e) => setNewCustomSection(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomSection()}
                          className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                        />
                        <Button onClick={addCustomSection}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {resumeData.customSections.map((section) => (
                        <div key={section.id} className="border border-border rounded-lg p-4 bg-card">
                          <div className="flex justify-between items-center border-b border-primary/20 pb-3 mb-4">
                            <h4 className="font-semibold text-lg">{section.title}</h4>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteCustomSection(section.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-muted rounded-lg p-4">
                              <div className="grid grid-cols-1 gap-4">
                                <Input
                                  placeholder="Subtopic title"
                                  value={newCustomItem[section.id]?.title || ''}
                                  onChange={(e) => setNewCustomItem(prev => ({
                                    ...prev,
                                    [section.id]: { ...prev[section.id], title: e.target.value }
                                  }))}
                                  className="border-b-2 border-primary/20 rounded-none border-l-0 border-r-0 border-t-0"
                                />
                                <Textarea
                                  placeholder="Content description"
                                  value={newCustomItem[section.id]?.content || ''}
                                  onChange={(e) => setNewCustomItem(prev => ({
                                    ...prev,
                                    [section.id]: { ...prev[section.id], content: e.target.value }
                                  }))}
                                  rows={3}
                                  className="border-2 border-primary/20"
                                />
                                <Button
                                  onClick={() => addCustomItem(section.id)}
                                  size="sm"
                                  className="w-full md:w-auto"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Item
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {section.items.map((item) => (
                                <div key={item.id} className="border-l-4 border-primary pl-4 py-2">
                                  <h5 className="font-medium">{item.title}</h5>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {resumeData.customSections.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Edit3 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                          <p>No custom sections yet. Create your first section above.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeSection === 'preview' && (
                  <div className="space-y-6">
                    <div className="bg-white text-black p-8 rounded-lg border shadow-lg">
                      <div className="border-b-4 border-gray-800 pb-4 mb-6">
                        <h1 className="text-3xl font-bold">{resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</h1>
                        {resumeData.personalInfo.title && (
                          <p className="text-xl text-gray-600 mt-1">{resumeData.personalInfo.title}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                        </div>
                      </div>

                      {resumeData.personalInfo.summary && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-3">PROFESSIONAL SUMMARY</h2>
                          <p className="text-sm leading-relaxed">{resumeData.personalInfo.summary}</p>
                        </div>
                      )}

                      {resumeData.experience.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-3">EXPERIENCE</h2>
                          {resumeData.experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                              <h3 className="font-semibold">{exp.position}</h3>
                              <p className="font-medium text-gray-700">{exp.company} • {exp.location}</p>
                              <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                              <p className="text-sm leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {resumeData.education.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-3">EDUCATION</h2>
                          {resumeData.education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                              <h3 className="font-semibold">{edu.degree}</h3>
                              <p className="font-medium text-gray-700">{edu.institution} • {edu.location}</p>
                              <p className="text-sm text-gray-600">{edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {resumeData.skills.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-3">SKILLS</h2>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill) => (
                              <span key={skill} className="bg-gray-100 px-3 py-1 text-sm rounded border">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {resumeData.customSections.map((section) => (
                        <div key={section.id} className="mb-6">
                          <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-3">{section.title.toUpperCase()}</h2>
                          {section.items.map((item) => (
                            <div key={item.id} className="mb-3">
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm leading-relaxed">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mobile Preview - only show on larger screens */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white text-black p-4 rounded border shadow-sm text-xs max-h-[600px] overflow-y-auto">
                  <div className="border-b-2 border-gray-800 pb-2 mb-3">
                    <h1 className="text-lg font-bold">{resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</h1>
                    {resumeData.personalInfo.title && (
                      <p className="text-sm text-gray-600">{resumeData.personalInfo.title}</p>
                    )}
                    <div className="text-xs text-gray-600 mt-1">
                      {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
                      {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
                      {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
                    </div>
                  </div>

                  {resumeData.personalInfo.summary && (
                    <div className="mb-3">
                      <h2 className="text-xs font-semibold border-b border-gray-300 pb-1 mb-2">SUMMARY</h2>
                      <p className="text-xs leading-tight">{resumeData.personalInfo.summary}</p>
                    </div>
                  )}

                  {resumeData.experience.length > 0 && (
                    <div className="mb-3">
                      <h2 className="text-xs font-semibold border-b border-gray-300 pb-1 mb-2">EXPERIENCE</h2>
                      {resumeData.experience.slice(0, 2).map((exp) => (
                        <div key={exp.id} className="mb-2">
                          <h3 className="text-xs font-semibold">{exp.position}</h3>
                          <p className="text-xs text-gray-700">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.skills.length > 0 && (
                    <div className="mb-3">
                      <h2 className="text-xs font-semibold border-b border-gray-300 pb-1 mb-2">SKILLS</h2>
                      <div className="flex flex-wrap gap-1">
                        {resumeData.skills.slice(0, 6).map((skill) => (
                          <span key={skill} className="bg-gray-100 px-1 py-0.5 text-xs rounded">{skill}</span>
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