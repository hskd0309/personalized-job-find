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

export default function AltaCV({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 font-serif">
      {/* Header */}
      <header className="bg-blue-900 text-white p-8">
        <div className="grid grid-cols-3 gap-6 items-center">
          <div className="col-span-2">
            <h1 className="text-4xl font-bold mb-2">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            <p className="text-xl text-blue-200">Academic Professional</p>
            {data.summary && (
              <p className="text-blue-100 mt-4 leading-relaxed">{data.summary}</p>
            )}
          </div>
          <div className="text-right space-y-2 text-sm">
            <div className="text-blue-200">CONTACT</div>
            <div className="space-y-1">
              <p>{data.personalInfo.email}</p>
              <p>{data.personalInfo.phone}</p>
              <p>{data.personalInfo.location}</p>
              {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 p-8">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-900 mb-3 border-b-2 border-blue-900 pb-1">
                EDUCATION
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-blue-700 font-medium">{edu.institution}</p>
                    <p className="text-gray-600 text-sm">{edu.startDate} — {edu.endDate}</p>
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-900 mb-3 border-b-2 border-blue-900 pb-1">
                SKILLS
              </h2>
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 space-y-8">
          {/* Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-900 pb-2">
                RESEARCH & PROFESSIONAL EXPERIENCE
              </h2>
              
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-300 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-blue-700 font-semibold text-lg">{exp.company}</p>
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

          {/* Publications Section */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-900 pb-2">
              PUBLICATIONS
            </h2>
            <div className="space-y-3">
              <div className="text-gray-700">
                <p className="italic">Selected publications will be listed here based on available data.</p>
              </div>
            </div>
          </section>

          {/* Awards & Honors */}
          <section>
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-900 pb-2">
              AWARDS & HONORS
            </h2>
            <div className="space-y-3">
              <div className="text-gray-700">
                <p className="italic">Awards and honors will be listed here based on available data.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}