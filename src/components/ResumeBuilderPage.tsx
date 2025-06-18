import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, FileText, User, Briefcase, GraduationCap, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function ResumeBuilderPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: ''
  });

  // Experience State
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false
  });

  // Education State
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    location: '',
    graduationDate: '',
    gpa: ''
  });

  // Skills State
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  // Custom Sections State
  const [customSections, setCustomSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addExperience = () => {
    if (newExperience.position && newExperience.company) {
      setExperiences([...experiences, { ...newExperience, id: Date.now() }]);
      setNewExperience({
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false
      });
    }
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setEducation([...education, { ...newEducation, id: Date.now() }]);
      setNewEducation({
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: ''
      });
    }
  };

  const addCustomSection = () => {
    if (newSectionTitle.trim()) {
      setCustomSections([...customSections, {
        id: Date.now(),
        title: newSectionTitle.trim(),
        items: []
      }]);
      setNewSectionTitle('');
    }
  };

  const downloadResume = async () => {
    try {
      const resumeData = {
        personalInfo,
        experiences,
        education,
        skills,
        customSections
      };

      // Call the edge function to generate the PDF
      const { data, error } = await supabase.functions.invoke('generate-resume-pdf', {
        body: { resumeData }
      });

      if (error) throw error;

      if (data?.html) {
        // Create a new window with the HTML content and trigger print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(data.html);
          printWindow.document.close();
          
          // Wait for content to load then trigger print dialog
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }
      }

      toast({
        title: "Resume Generated!",
        description: "Your professional resume is ready for download.",
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'preview', label: 'Preview', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Resume Builder</h1>
          <p className="text-muted-foreground">Create your professional resume</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </Button>
                  );
                })}
                <div className="pt-4 border-t">
                  <Button onClick={downloadResume} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <Input
                          value={personalInfo.firstName}
                          onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                          placeholder="John"
                          className="border-b-2 border-primary/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <Input
                          value={personalInfo.lastName}
                          onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                          placeholder="Doe"
                          className="border-b-2 border-primary/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Professional Title</label>
                      <Input
                        value={personalInfo.title}
                        onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})}
                        placeholder="Software Engineer"
                        className="border-b-2 border-primary/30"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          placeholder="john@example.com"
                          className="border-b-2 border-primary/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <Input
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                          className="border-b-2 border-primary/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <Input
                        value={personalInfo.location}
                        onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                        placeholder="New York, NY"
                        className="border-b-2 border-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Professional Summary</label>
                      <Textarea
                        value={personalInfo.summary}
                        onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                        placeholder="Brief summary of your professional background..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold">Add Experience</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Job Title"
                          value={newExperience.position}
                          onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                          className="border-b-2 border-primary/30"
                        />
                        <Input
                          placeholder="Company"
                          value={newExperience.company}
                          onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                          className="border-b-2 border-primary/30"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Location"
                          value={newExperience.location}
                          onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                          className="border-b-2 border-primary/30"
                        />
                        <Input
                          type="date"
                          value={newExperience.startDate}
                          onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                        />
                        <Input
                          type="date"
                          value={newExperience.endDate}
                          onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                          disabled={newExperience.current}
                        />
                      </div>
                      <Textarea
                        placeholder="Job description and achievements..."
                        value={newExperience.description}
                        onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newExperience.current}
                          onChange={(e) => setNewExperience({...newExperience, current: e.target.checked})}
                        />
                        <label className="text-sm">Currently working here</label>
                      </div>
                      <Button onClick={addExperience}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="border rounded-lg p-4">
                          <div className="border-b pb-2 mb-2">
                            <h4 className="font-semibold">{exp.position}</h4>
                            <p className="text-primary">{exp.company} • {exp.location}</p>
                            <p className="text-sm text-muted-foreground">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                          </div>
                          <p className="text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold">Add Education</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Degree"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                          className="border-b-2 border-primary/30"
                        />
                        <Input
                          placeholder="Institution"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                          className="border-b-2 border-primary/30"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Location"
                          value={newEducation.location}
                          onChange={(e) => setNewEducation({...newEducation, location: e.target.value})}
                          className="border-b-2 border-primary/30"
                        />
                        <Input
                          type="date"
                          value={newEducation.graduationDate}
                          onChange={(e) => setNewEducation({...newEducation, graduationDate: e.target.value})}
                        />
                        <Input
                          placeholder="GPA (Optional)"
                          value={newEducation.gpa}
                          onChange={(e) => setNewEducation({...newEducation, gpa: e.target.value})}
                          className="border-b-2 border-primary/30"
                        />
                      </div>
                      <Button onClick={addEducation}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {education.map((edu) => (
                        <div key={edu.id} className="border rounded-lg p-4">
                          <div className="border-b pb-2 mb-2">
                            <h4 className="font-semibold">{edu.degree}</h4>
                            <p className="text-primary">{edu.institution} • {edu.location}</p>
                            <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
                          </div>
                          {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-4">Add Skills</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter a skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="border-b-2 border-primary/30"
                        />
                        <Button onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold border-b pb-2">Your Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
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
                      {skills.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">
                          No skills added yet. Add your first skill above.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <div className="bg-white text-black p-8 rounded-lg border shadow-lg">
                      {/* Header */}
                      <div className="border-b-4 border-gray-800 pb-4 mb-6">
                        <h1 className="text-3xl font-bold">
                          {personalInfo.firstName} {personalInfo.lastName}
                        </h1>
                        {personalInfo.title && (
                          <p className="text-xl text-gray-600 mt-1">{personalInfo.title}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                          {personalInfo.email && <span>{personalInfo.email}</span>}
                          {personalInfo.phone && <span>{personalInfo.phone}</span>}
                          {personalInfo.location && <span>{personalInfo.location}</span>}
                        </div>
                      </div>

                      {/* Summary */}
                      {personalInfo.summary && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-3">
                            PROFESSIONAL SUMMARY
                          </h2>
                          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {experiences.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-3">
                            EXPERIENCE
                          </h2>
                          {experiences.map((exp) => (
                            <div key={exp.id} className="mb-4">
                              <h3 className="font-semibold">{exp.position}</h3>
                              <p className="font-medium text-gray-700">{exp.company} • {exp.location}</p>
                              <p className="text-sm text-gray-600 mb-2">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </p>
                              <p className="text-sm leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Education */}
                      {education.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-3">
                            EDUCATION
                          </h2>
                          {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                              <h3 className="font-semibold">{edu.degree}</h3>
                              <p className="font-medium text-gray-700">{edu.institution} • {edu.location}</p>
                              <p className="text-sm text-gray-600">
                                {edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Skills */}
                      {skills.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b-2 border-gray-300 pb-1 mb-3">
                            SKILLS
                          </h2>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                              <span key={skill} className="bg-gray-100 px-3 py-1 text-sm rounded border">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}