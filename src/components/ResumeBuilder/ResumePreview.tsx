import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
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
      const { data: pdfData, error } = await supabase.functions.invoke('generate-resume', {
        body: { resumeData: data, templateId }
      });

      if (error) throw error;

      // Create blob and download
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.personalInfo.firstName}_${data.personalInfo.lastName}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Resume Downloaded!",
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
        <div className="bg-white text-black p-8 mx-auto max-w-[8.5in] min-h-[11in] shadow-lg">
          {/* Header */}
          <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            <div className="text-gray-600 mt-2 space-y-1">
              <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
              <p>{data.personalInfo.location}</p>
              {data.personalInfo.linkedin && (
                <p>LinkedIn: {data.personalInfo.linkedin}</p>
              )}
              {data.personalInfo.website && (
                <p>Website: {data.personalInfo.website}</p>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 border-b border-gray-300 pb-1 mb-3">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 border-b border-gray-300 pb-1 mb-3">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{exp.position}</h3>
                        <p className="text-blue-600 font-semibold">{exp.company}</p>
                        <p className="text-gray-600 text-sm">{exp.location}</p>
                      </div>
                      <div className="text-gray-600 text-sm text-right">
                        <p>
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </p>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 border-b border-gray-300 pb-1 mb-3">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                      <p className="text-blue-600">{edu.institution}</p>
                      <p className="text-gray-600 text-sm">{edu.location}</p>
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-gray-600 text-sm text-right">
                      <p>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 border-b border-gray-300 pb-1 mb-3">
                TECHNICAL SKILLS
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span 
                    key={skill}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}