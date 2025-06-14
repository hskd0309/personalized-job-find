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

export default function AwesomeCV({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 font-sans">
      {/* Header with Color Bar */}
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
        
        <header className="px-8 pt-8 pb-6">
          <div className="text-center">
            <h1 className="text-5xl font-thin text-gray-800 tracking-wide">
              {data.personalInfo.firstName} <span className="font-bold">{data.personalInfo.lastName}</span>
            </h1>
            <div className="mt-4 flex flex-wrap justify-center gap-6 text-gray-600">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                {data.personalInfo.email}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                {data.personalInfo.phone}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                {data.personalInfo.location}
              </span>
            </div>
          </div>
        </header>
      </div>

      <div className="px-8 pb-8">
        {/* Summary */}
        {data.summary && (
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-red-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">About Me</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-10">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Experience</h2>
            </div>
            <div className="ml-10 space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                      <p className="text-orange-600 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-gray-600 text-sm mt-1 md:mt-0">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  {index < data.experience.length - 1 && (
                    <div className="mt-6 border-b border-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-yellow-500 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Education</h2>
              </div>
              <div className="ml-10 space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                    <p className="text-yellow-600 font-medium">{edu.institution}</p>
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
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Skills</h2>
              </div>
              <div className="ml-10">
                <div className="grid grid-cols-1 gap-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}