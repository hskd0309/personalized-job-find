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

export default function WilsonResume({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 font-serif p-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-light tracking-wide mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="text-gray-600 text-sm space-x-3">
          <span>{data.personalInfo.email}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span>{data.personalInfo.location}</span>
        </div>
        {data.personalInfo.linkedin && (
          <div className="text-gray-600 text-sm mt-1">
            {data.personalInfo.linkedin}
          </div>
        )}
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 tracking-wide">SUMMARY</h2>
          <div className="border-t border-gray-300 pt-3">
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 tracking-wide">EXPERIENCE</h2>
          <div className="border-t border-gray-300 pt-3">
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700 italic">{exp.company}</p>
                    </div>
                    <div className="text-gray-600 text-sm text-right">
                      <div>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</div>
                      <div>{exp.location}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education and Skills Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 tracking-wide">EDUCATION</h2>
            <div className="border-t border-gray-300 pt-3">
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700 italic">{edu.institution}</p>
                    <p className="text-gray-600 text-sm">{edu.startDate} — {edu.endDate}</p>
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 tracking-wide">SKILLS</h2>
            <div className="border-t border-gray-300 pt-3">
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div key={index} className="text-gray-700">
                    {skill}
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