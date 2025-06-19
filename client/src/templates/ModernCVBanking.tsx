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

export default function ModernCVBanking({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 font-serif">
      {/* Header */}
      <header className="border-b-4 border-gray-800 pb-6 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h1>
          <div className="text-gray-700 text-sm space-x-4">
            <span>{data.personalInfo.email}</span>
            <span>•</span>
            <span>{data.personalInfo.phone}</span>
            <span>•</span>
            <span>{data.personalInfo.location}</span>
          </div>
          {data.personalInfo.linkedin && (
            <div className="text-gray-700 text-sm mt-1">
              {data.personalInfo.linkedin}
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
            Professional Summary
          </h2>
          <div className="border-l-4 border-gray-800 pl-4">
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-800 font-semibold">{exp.company}</p>
                    <p className="text-gray-600 text-sm">{exp.location}</p>
                  </div>
                  <div className="text-gray-600 text-sm text-right">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-gray-300 pl-4">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-800 font-medium">{edu.institution}</p>
                  <p className="text-gray-600 text-sm">{edu.location}</p>
                  <p className="text-gray-600 text-sm">{edu.startDate} — {edu.endDate}</p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Technical Skills
            </h2>
            <div className="border-l-4 border-gray-300 pl-4">
              <div className="grid grid-cols-1 gap-2">
                {data.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-gray-800 rounded-full mr-3"></div>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}