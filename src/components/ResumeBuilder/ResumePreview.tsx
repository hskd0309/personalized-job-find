import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { resumeTemplates } from '@/components/resume/ResumeTemplates';

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

export function ResumePreview({ data, templateId }: ResumePreviewProps) {
  const { toast } = useToast();

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
    
    if (templateId === 'professional') {
      return (
        <div className="resume-template professional">
          <header className="header text-center border-b-2 border-primary pb-4 mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            <div className="contact-info text-muted-foreground mt-2 space-y-1">
              <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
              <p>{data.personalInfo.location}</p>
              {data.personalInfo.linkedin && <p>LinkedIn: {data.personalInfo.linkedin}</p>}
              {data.personalInfo.website && <p>Website: {data.personalInfo.website}</p>}
            </div>
          </header>

          {data.summary && (
            <section className="summary mb-6">
              <h2 className="text-xl font-bold text-primary border-b border-border pb-1 mb-3">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-foreground leading-relaxed">{data.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="experience mb-6">
              <h2 className="text-xl font-bold text-primary border-b border-border pb-1 mb-3">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
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

          {data.education.length > 0 && (
            <section className="education mb-6">
              <h2 className="text-xl font-bold text-primary border-b border-border pb-1 mb-3">EDUCATION</h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
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

          {data.skills.length > 0 && (
            <section className="skills">
              <h2 className="text-xl font-bold text-primary border-b border-border pb-1 mb-3">TECHNICAL SKILLS</h2>
              <div className="skills-list flex flex-wrap gap-2">
                {data.skills.map((skill) => (
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
                {data.personalInfo.firstName}<br/>{data.personalInfo.lastName}
              </h1>
              <div className="contact mt-4 space-y-2 text-sm text-muted-foreground">
                <div>{data.personalInfo.email}</div>
                <div>{data.personalInfo.phone}</div>
                <div>{data.personalInfo.location}</div>
              </div>
            </div>
            
            {data.skills.length > 0 && (
              <section className="skills">
                <h2 className="text-lg font-bold text-primary mb-3">Skills</h2>
                <div className="space-y-2">
                  {data.skills.map((skill) => (
                    <div key={skill} className="skill-item bg-primary/10 p-2 rounded text-sm">{skill}</div>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          <div className="main-content md:col-span-2 space-y-6">
            {data.summary && (
              <section className="summary">
                <h2 className="text-xl font-bold text-primary mb-3">About Me</h2>
                <p className="text-foreground leading-relaxed">{data.summary}</p>
              </section>
            )}
            
            {data.experience.length > 0 && (
              <section className="experience">
                <h2 className="text-xl font-bold text-primary mb-3">Experience</h2>
                <div className="space-y-4">
                  {data.experience.map((exp) => (
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
            
            {data.education.length > 0 && (
              <section className="education">
                <h2 className="text-xl font-bold text-primary mb-3">Education</h2>
                <div className="space-y-3">
                  {data.education.map((edu) => (
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

    // Default template for other cases
    return (
      <div className="resume-template bg-white text-black p-8">
        <div className="text-center border-b-2 border-primary pb-4 mb-6">
          <h1 className="text-3xl font-bold">{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
          <div className="text-muted-foreground mt-2">
            <p>{data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}</p>
          </div>
        </div>
        {/* Add other sections as needed */}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Preview</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hover-scale">
            <Eye className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
          <Button size="sm" onClick={downloadResume} className="hover-scale">
            <Download className="h-4 w-4 mr-2" />
            Download HTML
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
        <div className="bg-background text-foreground p-8 mx-auto max-w-[8.5in] min-h-[11in] shadow-lg rounded-lg animate-scale-in">
          {renderTemplate()}
        </div>
      </CardContent>
    </Card>
  );
}