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

export default function FriggeriCV({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white font-sans">
      <div className="grid grid-cols-4 min-h-screen">
        {/* Sidebar */}
        <div className="bg-gray-800 text-white p-8">
          <div className="space-y-8">
            {/* Name */}
            <div>
              <h1 className="text-3xl font-light">
                {data.personalInfo.firstName}
              </h1>
              <h1 className="text-3xl font-bold -mt-2">
                {data.personalInfo.lastName}
              </h1>
            </div>

            {/* Contact */}
            <div className="space-y-3 text-sm">
              <div className="border-b border-gray-600 pb-2">
                <h2 className="text-white font-semibold uppercase tracking-wider mb-3">Contact</h2>
              </div>
              <div className="space-y-2">
                <p className="text-gray-300">{data.personalInfo.email}</p>
                <p className="text-gray-300">{data.personalInfo.phone}</p>
                <p className="text-gray-300">{data.personalInfo.location}</p>
                {data.personalInfo.linkedin && (
                  <p className="text-gray-300">{data.personalInfo.linkedin}</p>
                )}
              </div>
            </div>

            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="space-y-3 text-sm">
                <div className="border-b border-gray-600 pb-2">
                  <h2 className="text-white font-semibold uppercase tracking-wider mb-3">Skills</h2>
                </div>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-300 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="space-y-3 text-sm">
                <div className="border-b border-gray-600 pb-2">
                  <h2 className="text-white font-semibold uppercase tracking-wider mb-3">Education</h2>
                </div>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="text-white font-medium text-sm">{edu.degree}</h3>
                      <p className="text-orange-400 text-sm">{edu.institution}</p>
                      <p className="text-gray-400 text-xs">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-3 p-8 bg-gray-50">
          {/* Summary */}
          {data.summary && (
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-light text-gray-800 mr-4">About</h2>
                <div className="flex-1 h-px bg-orange-500"></div>
              </div>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-light text-gray-800 mr-4">Experience</h2>
                <div className="flex-1 h-px bg-orange-500"></div>
              </div>
              
              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-4 top-2 w-3 h-3 bg-orange-500 rounded-full"></div>
                    
                    <div className="ml-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                          <p className="text-orange-600 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-gray-600 text-sm md:text-right mt-1 md:mt-0">
                          <div>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                          <div className="text-gray-500">{exp.location}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
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