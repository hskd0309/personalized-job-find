import React from 'react';

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
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
}

interface TemplateProps {
  data: ResumeData;
}

export default function DeedyResume({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 font-mono text-sm">
      {/* Header */}
      <header className="border-b-4 border-gray-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-center mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="text-center text-gray-700">
          <span>{data.personalInfo.email}</span>
          <span className="mx-2">•</span>
          <span>{data.personalInfo.phone}</span>
          <span className="mx-2">•</span>
          <span>{data.personalInfo.location}</span>
          {data.personalInfo.linkedin && (
            <>
              <span className="mx-2">•</span>
              <span>{data.personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Summary */}
          {data.summary && (
            <section>
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide">
                Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide">
                Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-700 italic">{exp.company}, {exp.location}</p>
                      </div>
                      <div className="text-gray-600 text-sm">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide">
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                    <p className="text-gray-700 text-sm">{edu.institution}</p>
                    <p className="text-gray-600 text-xs">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide">
                Skills
              </h2>
              <div className="space-y-1">
                {data.skills.map((skill, index) => (
                  <div key={index} className="text-gray-700 text-sm">
                    • {skill}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}