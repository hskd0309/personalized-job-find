import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { resumeTemplates } from '@/components/resume/ResumeTemplates';
import { resumeTemplateMap } from '@/templates';

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

interface ResumePreviewProps {
  data: ResumeData;
  templateId: string;
}

// Example data for template preview
const exampleData: ResumeData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+91 9876543210',
    location: 'Mumbai, India',
    website: 'johndoe.dev',
    linkedin: 'linkedin.com/in/johndoe'
  },
  summary: 'Experienced software engineer with 5+ years in full-stack development. Specialized in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading cross-functional teams.',
  experience: [
    {
      id: '1',
      position: 'Senior Software Engineer',
      company: 'Tech Innovations Ltd',
      location: 'Mumbai, India',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 70%. Mentored junior developers and conducted code reviews.'
    },
    {
      id: '2',
      position: 'Software Developer',
      company: 'StartupXYZ',
      location: 'Bangalore, India',
      startDate: '2019-06',
      endDate: '2020-12',
      current: false,
      description: 'Developed responsive web applications using React and TypeScript. Collaborated with UX team to improve user engagement by 40%. Built RESTful APIs with Node.js and MongoDB.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Technology in Computer Science',
      institution: 'Indian Institute of Technology',
      location: 'Delhi, India',
      startDate: '2015-07',
      endDate: '2019-05',
      gpa: '8.5/10'
    }
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'Git', 'Agile']
};

export function ResumePreview({ data, templateId }: ResumePreviewProps) {
  const { toast } = useToast();
  
  // Use example data if no data is provided or if data is mostly empty
  const isDataEmpty = !data.personalInfo.firstName && !data.personalInfo.lastName && 
                     data.experience.length === 0 && data.education.length === 0;
  const displayData = isDataEmpty ? exampleData : data;

  const downloadResume = async () => {
    try {
      // Create HTML content and download
      const htmlContent = generateResumeHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.personalInfo.firstName}_${data.personalInfo.lastName}_Resume.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Resume Downloaded!",
        description: "Your resume has been downloaded as HTML.",
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

  const generateResumeHTML = () => {
    const template = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];
    let html = template.template;
    
    // Replace template variables
    html = html.replace(/\{\{firstName\}\}/g, data.personalInfo.firstName);
    html = html.replace(/\{\{lastName\}\}/g, data.personalInfo.lastName);
    html = html.replace(/\{\{email\}\}/g, data.personalInfo.email);
    html = html.replace(/\{\{phone\}\}/g, data.personalInfo.phone);
    html = html.replace(/\{\{location\}\}/g, data.personalInfo.location);
    html = html.replace(/\{\{summary\}\}/g, data.summary);
    
    // Add CSS for templates
    const styles = `
      <style>
        .resume-template { font-family: Arial, sans-serif; max-width: 8.5in; margin: 0 auto; padding: 1in; background: white; }
        .professional .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 1rem; margin-bottom: 1.5rem; }
        .professional h1 { font-size: 2rem; font-weight: bold; color: #1f2937; margin: 0; }
        .professional .contact-info { color: #6b7280; margin-top: 0.5rem; }
        .professional h2 { color: #2563eb; font-size: 1.25rem; font-weight: bold; border-bottom: 1px solid #d1d5db; padding-bottom: 0.25rem; margin-bottom: 0.75rem; }
        .professional .job { margin-bottom: 1rem; }
        .professional .job h3 { font-weight: bold; color: #1f2937; margin: 0; }
        .professional .company { color: #2563eb; font-weight: 600; }
        .professional .dates { color: #6b7280; font-size: 0.875rem; }
        .modern { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
        .modern .sidebar { background: #f3f4f6; padding: 1.5rem; }
        .modern h1 { font-size: 1.75rem; font-weight: bold; color: #1f2937; }
        .modern h2 { color: #2563eb; font-size: 1.125rem; font-weight: bold; margin-bottom: 0.75rem; }
      </style>
    `;
    
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume</title>${styles}</head><body>${html}</body></html>`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderTemplate = () => {
    const template = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];
    
    // Check if we have a custom React component for this template
    const TemplateComponent = resumeTemplateMap[templateId as keyof typeof resumeTemplateMap];
    
    if (TemplateComponent) {
      return <TemplateComponent data={displayData} />;
    }
    
    // Fallback to existing hardcoded templates
    if (templateId === 'professional') {
      return (
        <div className="resume-template professional">
          <header className="header text-center border-b-2 border-primary pb-4 mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              {displayData.personalInfo.firstName} {displayData.personalInfo.lastName}
            </h1>
            <div className="contact-info text-muted-foreground mt-2 space-y-1">
              <p>{displayData.personalInfo.email} | {displayData.personalInfo.phone}</p>
              <p>{displayData.personalInfo.location}</p>
              {displayData.personalInfo.linkedin && <p>LinkedIn: {displayData.personalInfo.linkedin}</p>}
              {displayData.personalInfo.website && <p>Website: {displayData.personalInfo.website}</p>}
            </div>
          </header>

          {displayData.summary && (
            <section className="summary mb-6">
              <h2 className="text-xl font-bold text-primary border-b border-border pb-1 mb-3">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-foreground leading-relaxed">{displayData.summary}</p>
            </section>
          )}

          {displayData.experience.length > 0 && (
            <section className="experience mb-6">
              <h2 className="text-xl font-bold text-primary border-b border-border pb-1 mb-3">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-4">
                {displayData.experience.map((exp) => (
                  <div key={exp.id} className="job">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-foreground">{exp.position}</h3>
                        <div className="company text-primary font-semibold">{exp.company}</div>
                        <div className="text-muted-foreground text-sm">{exp.location}</div>
                      </div>
                      <div className="dates text-muted-foreground text-sm text-right">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.description && <p className="text-foreground mt-2 leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {displayData.education.length > 0 && (
            <section className="education mb-6">
              <h2 className="text-xl font-bold text-primary border-b border-border pb-1 mb-3">EDUCATION</h2>
              <div className="space-y-3">
                {displayData.education.map((edu) => (
                  <div key={edu.id} className="school flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-foreground">{edu.degree}</h3>
                      <div className="text-primary">{edu.institution}</div>
                      <div className="text-muted-foreground text-sm">{edu.location}</div>
                      {edu.gpa && <div className="text-muted-foreground text-sm">GPA: {edu.gpa}</div>}
                    </div>
                    <div className="text-muted-foreground text-sm text-right">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {displayData.skills.length > 0 && (
            <section className="skills">
              <h2 className="text-xl font-bold text-primary border-b border-border pb-1 mb-3">TECHNICAL SKILLS</h2>
              <div className="skills-list flex flex-wrap gap-2">
                {displayData.skills.map((skill) => (
                  <span key={skill} className="skill bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      );
    }

    if (templateId === 'modern') {
      return (
        <div className="resume-template modern grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="sidebar md:col-span-1 bg-secondary/20 p-6 rounded-lg">
            <div className="profile text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                {displayData.personalInfo.firstName}<br/>{displayData.personalInfo.lastName}
              </h1>
              <div className="contact mt-4 space-y-2 text-sm text-muted-foreground">
                <div>{displayData.personalInfo.email}</div>
                <div>{displayData.personalInfo.phone}</div>
                <div>{displayData.personalInfo.location}</div>
              </div>
            </div>
            
            {displayData.skills.length > 0 && (
              <section className="skills">
                <h2 className="text-lg font-bold text-primary mb-3">Skills</h2>
                <div className="space-y-2">
                  {displayData.skills.map((skill) => (
                    <div key={skill} className="skill-item bg-primary/10 p-2 rounded text-sm">{skill}</div>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          <div className="main-content md:col-span-2 space-y-6">
            {displayData.summary && (
              <section className="summary">
                <h2 className="text-xl font-bold text-primary mb-3">About Me</h2>
                <p className="text-foreground leading-relaxed">{displayData.summary}</p>
              </section>
            )}
            
            {displayData.experience.length > 0 && (
              <section className="experience">
                <h2 className="text-xl font-bold text-primary mb-3">Experience</h2>
                <div className="space-y-4">
                  {displayData.experience.map((exp) => (
                    <div key={exp.id} className="job border-l-2 border-primary pl-4">
                      <h3 className="font-bold text-foreground">{exp.position}</h3>
                      <div className="meta text-primary font-medium">
                        {exp.company} | {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </div>
                      {exp.description && <p className="text-foreground mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {displayData.education.length > 0 && (
              <section className="education">
                <h2 className="text-xl font-bold text-primary mb-3">Education</h2>
                <div className="space-y-3">
                  {displayData.education.map((edu) => (
                    <div key={edu.id} className="school">
                      <h3 className="font-bold text-foreground">{edu.degree}</h3>
                      <div className="text-primary">{edu.institution} | {formatDate(edu.startDate)} - {formatDate(edu.endDate)}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      );
    }

    // Universal fallback template renderer for all new templates
    return renderFallbackTemplate(template);
  };

  // Universal fallback template renderer
  const renderFallbackTemplate = (template: any) => {
    const getTemplateStyles = () => {
      switch (template.category) {
        case 'Academic':
          return {
            headerBg: 'bg-blue-50',
            headerText: 'text-blue-900',
            accentColor: 'border-blue-500',
            skillBg: 'bg-blue-100',
            skillText: 'text-blue-800'
          };
        case 'Creative':
          return {
            headerBg: 'bg-purple-50',
            headerText: 'text-purple-900',
            accentColor: 'border-purple-500',
            skillBg: 'bg-purple-100',
            skillText: 'text-purple-800'
          };
        case 'Technical':
          return {
            headerBg: 'bg-green-50',
            headerText: 'text-green-900',
            accentColor: 'border-green-500',
            skillBg: 'bg-green-100',
            skillText: 'text-green-800'
          };
        case 'Finance':
          return {
            headerBg: 'bg-gray-50',
            headerText: 'text-gray-900',
            accentColor: 'border-gray-500',
            skillBg: 'bg-gray-100',
            skillText: 'text-gray-800'
          };
        case 'Modern':
          return {
            headerBg: 'bg-gradient-to-r from-primary/10 to-secondary/10',
            headerText: 'text-foreground',
            accentColor: 'border-primary',
            skillBg: 'bg-primary/10',
            skillText: 'text-primary'
          };
        default:
          return {
            headerBg: 'bg-background',
            headerText: 'text-foreground',
            accentColor: 'border-primary',
            skillBg: 'bg-primary/10',
            skillText: 'text-primary'
          };
      }
    };

    const styles = getTemplateStyles();
    
    return (
      <div className={`resume-template ${template.id} bg-background text-foreground`}>
        {/* Header Section */}
        <header className={`header ${styles.headerBg} p-6 rounded-lg mb-6`}>
          <h1 className={`text-3xl font-bold ${styles.headerText} text-center`}>
            {displayData.personalInfo.firstName} {displayData.personalInfo.lastName}
          </h1>
          <div className="contact-info text-center mt-3 text-muted-foreground">
            <div className="flex justify-center items-center gap-3 text-sm">
              <span>{displayData.personalInfo.email}</span>
              <span>•</span>
              <span>{displayData.personalInfo.phone}</span>
              <span>•</span>
              <span>{displayData.personalInfo.location}</span>
            </div>
          </div>
        </header>

        {/* Summary Section */}
        {displayData.summary && (
          <section className="summary mb-6">
            <h2 className={`text-xl font-semibold ${styles.headerText} border-b-2 ${styles.accentColor} pb-2 mb-4`}>
              Professional Summary
            </h2>
            <p className="text-foreground leading-relaxed">{displayData.summary}</p>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Experience Section */}
            {displayData.experience.length > 0 && (
              <section className="experience mb-6">
                <h2 className={`text-xl font-semibold ${styles.headerText} border-b-2 ${styles.accentColor} pb-2 mb-4`}>
                  Professional Experience
                </h2>
                {displayData.experience.map((exp, index) => (
                  <div key={index} className="job mb-5 pb-4 border-b border-border last:border-b-0">
                    <h3 className="text-lg font-semibold text-foreground">{exp.position}</h3>
                    <div className="company-info text-primary font-medium">{exp.company}</div>
                    <div className="location-date text-muted-foreground text-sm mb-2">
                      {exp.location} | {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                    <p className="text-foreground">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Education Section */}
            {displayData.education.length > 0 && (
              <section className="education mb-6">
                <h2 className={`text-xl font-semibold ${styles.headerText} border-b-2 ${styles.accentColor} pb-2 mb-4`}>
                  Education
                </h2>
                {displayData.education.map((edu, index) => (
                  <div key={index} className="school mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                    <div className="institution text-primary font-medium">{edu.institution}</div>
                    <div className="location-date text-muted-foreground text-sm">
                      {edu.location} | {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                    {edu.gpa && (
                      <div className="gpa text-muted-foreground text-sm">GPA: {edu.gpa}</div>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Skills Section */}
            {displayData.skills.length > 0 && (
              <section className="skills">
                <h2 className={`text-xl font-semibold ${styles.headerText} border-b-2 ${styles.accentColor} pb-2 mb-4`}>
                  Skills & Expertise
                </h2>
                <div className="skills-grid">
                  {displayData.skills.map((skill, index) => (
                    <div key={index} className={`skill ${styles.skillBg} ${styles.skillText} px-3 py-2 rounded text-sm mb-2 font-medium`}>
                      {skill}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Preview</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
          <Button size="sm" onClick={downloadResume}>
            <Download className="h-4 w-4 mr-2" />
            Download HTML
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
        <div className="bg-background text-foreground p-8 mx-auto max-w-[8.5in] min-h-[11in] shadow-lg rounded-lg">
          {renderTemplate()}
        </div>
      </CardContent>
    </Card>
  );
}