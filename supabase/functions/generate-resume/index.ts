import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
  };
  experiences: Array<{
    id: number;
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    id: number;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa: string;
  }>;
  skills: string[];
  customSections: Array<{
    id: number;
    title: string;
    items: any[];
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, template = 'html' } = await req.json();
    
    if (!resumeData) {
      return new Response(
        JSON.stringify({ error: 'Resume data is required', success: false }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Generating resume for:', resumeData.personalInfo?.firstName);

    if (template === 'html') {
      // Generate HTML for PDF printing
      const htmlContent = generateResumeHTML(resumeData);
      
      return new Response(
        JSON.stringify({
          success: true,
          html: htmlContent,
          message: "HTML resume generated successfully"
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } else {
      // Generate LaTeX content for legacy support
      const latexContent = template === 'photo' ? 
        generatePhotoTemplate(resumeData) : 
        generateStandardTemplate(resumeData);

      return new Response(
        JSON.stringify({
          success: true,
          latex_content: latexContent,
          message: "LaTeX resume generated successfully",
          pdf_url: "data:text/plain;charset=utf-8," + encodeURIComponent(latexContent)
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  } catch (error) {
    console.error('Error generating resume:', error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

function generateResumeHTML(resumeData: ResumeData): string {
  const { personalInfo, experiences, education, skills, customSections } = resumeData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 40px;
          color: #000;
          line-height: 1.6;
        }
        .header {
          border-bottom: 4px solid #1f2937;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .name {
          font-size: 36px;
          font-weight: bold;
          margin: 0;
        }
        .title {
          font-size: 20px;
          color: #6b7280;
          margin: 4px 0;
        }
        .contact {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #6b7280;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .section {
          margin-bottom: 24px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          border-bottom: 2px solid #d1d5db;
          padding-bottom: 4px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .job, .education-item {
          margin-bottom: 16px;
        }
        .job-title, .degree {
          font-weight: 600;
        }
        .company, .institution {
          font-weight: 500;
          color: #374151;
        }
        .date, .location {
          font-size: 14px;
          color: #6b7280;
        }
        .description {
          font-size: 14px;
          line-height: 1.5;
          margin-top: 8px;
        }
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill {
          background: #f3f4f6;
          padding: 4px 12px;
          font-size: 14px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }
        @media print {
          body { margin: 0; padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="name">${personalInfo.firstName} ${personalInfo.lastName}</h1>
        ${personalInfo.title ? `<p class="title">${personalInfo.title}</p>` : ''}
        <div class="contact">
          ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
          ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
          ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
        </div>
      </div>

      ${personalInfo.summary ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="description">${personalInfo.summary}</p>
        </div>
      ` : ''}

      ${experiences.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${experiences.map(exp => `
            <div class="job">
              <h3 class="job-title">${exp.position}</h3>
              <p class="company">${exp.company} • ${exp.location}</p>
              <p class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
              ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${education.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${education.map(edu => `
            <div class="education-item">
              <h3 class="degree">${edu.degree}</h3>
              <p class="institution">${edu.institution} • ${edu.location}</p>
              <p class="date">${edu.graduationDate} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-container">
            ${skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${customSections.map(section => `
        <div class="section">
          <h2 class="section-title">${section.title}</h2>
          ${section.items.length > 0 ? section.items.map(item => `<p class="description">${item}</p>`).join('') : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
}

function generateStandardTemplate(data: any): string {
  return `% !TEX program = xelatex
\\documentclass{resume}
\\begin{document}
\\pagenumbering{gobble}
\\name{${data.personalInfo.name}}
\\basicInfo{
  \\email{${data.personalInfo.email}} \\textperiodcentered\\ 
  \\phone{${data.personalInfo.phone}} \\textperiodcentered\\ 
  \\linkedin[profile]{${data.personalInfo.linkedin}}}

\\section{\\faUser\\ Summary}
${data.summary}

\\section{\\faGraduationCap\\ Education}
${data.education.map((edu: any) => `\\datedsubsection{\\textbf{${edu.institution}}, ${edu.location}}{${edu.duration}}
\\textit{${edu.degree}}`).join('\n\n')}

\\section{\\faUsers\\ Experience}
${data.experience.map((exp: any) => `\\datedsubsection{\\textbf{${exp.company}} ${exp.location}}{${exp.duration}}
\\role{${exp.position}}{${exp.company}}
${exp.description}`).join('\n\n')}

\\section{\\faCogs\\ Skills}
\\begin{itemize}[parsep=0.5ex]
${data.skills.map((skill: any) => `  \\item ${skill.category}: ${skill.items.join(', ')}`).join('\n')}
\\end{itemize}

\\end{document}`;
}

function generatePhotoTemplate(data: any): string {
  return `% !TEX program = xelatex
\\documentclass{resume}
\\usepackage{graphicx}
\\usepackage{tabu}
\\usepackage{multirow}
\\begin{document}
\\pagenumbering{gobble}

{\\Large{
  \\begin{tabu}{ c l r }
   \\multirow{5}{1in}{\\includegraphics[width=0.88in]{avatar}} & \\scshape{${data.personalInfo.name}} & Skills \\\\
    & \\email{${data.personalInfo.email}} & \\\\
    & \\phone{${data.personalInfo.phone}} & \\\\
    & \\linkedin[profile]{${data.personalInfo.linkedin}} & \\\\
    & \\github[profile]{${data.personalInfo.github}} &
  \\end{tabu}
}}

\\section{\\faGraduationCap\\ Education}
${data.education.map((edu: any) => `\\datedsubsection{\\textbf{${edu.institution}}, ${edu.location}}{${edu.duration}}
\\textit{${edu.degree}}`).join('\n\n')}

\\section{\\faUsers\\ Experience}  
${data.experience.map((exp: any) => `\\datedsubsection{\\textbf{${exp.company}} ${exp.location}}{${exp.duration}}
\\role{${exp.position}}{${exp.company}}
${exp.description}`).join('\n\n')}

\\end{document}`;
}