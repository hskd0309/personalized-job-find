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

export default function ModernCVCasual({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            <p className="text-xl text-blue-100">Professional</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="space-y-1">
              <p className="text-blue-100">{data.personalInfo.email}</p>
              <p className="text-blue-100">{data.personalInfo.phone}</p>
              <p className="text-blue-100">{data.personalInfo.location}</p>
              {data.personalInfo.linkedin && (
                <p className="text-blue-100">{data.personalInfo.linkedin}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8 p-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Summary */}
          {data.summary && (
            <section>
              <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                Professional Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-300 pl-4">
                    <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                    <div className="text-blue-600 font-medium">{exp.company}</div>
                    <div className="text-gray-600 text-sm mb-2">
                      {exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-blue-600 text-sm">{edu.institution}</p>
                    <p className="text-gray-600 text-sm">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                Skills
              </h2>
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
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
}