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

export default function TwentySecondsCV({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white font-sans">
      <div className="grid grid-cols-3">
        {/* Sidebar */}
        <div className="bg-gradient-to-b from-indigo-600 to-purple-700 text-white p-6">
          {/* Profile Circle */}
          <div className="text-center mb-6">
            <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-indigo-600 font-bold">
                {data.personalInfo.firstName.charAt(0)}{data.personalInfo.lastName.charAt(0)}
              </span>
            </div>
            <h1 className="text-2xl font-bold">
              {data.personalInfo.firstName}
            </h1>
            <h1 className="text-2xl font-light -mt-1">
              {data.personalInfo.lastName}
            </h1>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-1">CONTACT</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white rounded-full mr-3"></div>
                <span>{data.personalInfo.email}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white rounded-full mr-3"></div>
                <span>{data.personalInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white rounded-full mr-3"></div>
                <span>{data.personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Skills with Progress Bars */}
          {data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-1">SKILLS</h2>
              <div className="space-y-3">
                {data.skills.slice(0, 8).map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill}</span>
                      <span>{Math.floor(Math.random() * 20 + 80)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full" 
                        style={{ width: `${Math.floor(Math.random() * 20 + 80)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-1">EDUCATION</h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-white/80">{edu.institution}</p>
                    <p className="text-white/60 text-xs">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 p-8">
          {/* About Me */}
          {data.summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4 flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-full mr-3"></div>
                ABOUT ME
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-indigo-600 mb-4 flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-full mr-3"></div>
                EXPERIENCE
              </h2>
              
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    {/* Timeline */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-indigo-200"></div>
                    <div className="absolute left-0 top-2 w-3 h-3 bg-indigo-600 rounded-full -ml-1"></div>
                    
                    <div className="ml-8">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                          <p className="text-indigo-600 font-semibold">{exp.company}</p>
                        </div>
                        <div className="text-gray-600 text-sm text-right">
                          <div className="bg-indigo-100 px-3 py-1 rounded-full">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </div>
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