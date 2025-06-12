import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, templateId } = await req.json();

    // Generate PDF resume
    const pdfBuffer = await generateResumePDF(resumeData, templateId);

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"'
      },
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateResumePDF(resumeData: any, templateId: string) {
  // Basic PDF generation logic - you can enhance this with a proper PDF library
  const htmlContent = generateResumeHTML(resumeData, templateId);
  
  // For now, return HTML as PDF placeholder
  // In production, you'd use a library like puppeteer or jsPDF
  return new TextEncoder().encode(htmlContent);
}

function generateResumeHTML(data: any, templateId: string) {
  const { personalInfo, experience, education, skills, summary } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Resume</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .name { font-size: 28px; font-weight: bold; color: #2c3e50; }
        .contact { margin-top: 10px; color: #7f8c8d; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 18px; font-weight: bold; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-bottom: 15px; }
        .experience-item { margin-bottom: 15px; }
        .job-title { font-weight: bold; color: #2c3e50; }
        .company { color: #3498db; }
        .date { color: #7f8c8d; font-style: italic; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #ecf0f1; padding: 5px 10px; border-radius: 15px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${personalInfo.firstName} ${personalInfo.lastName}</div>
        <div class="contact">
          ${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}
        </div>
      </div>
      
      ${summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p>${summary}</p>
        </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map((exp: any) => `
          <div class="experience-item">
            <div class="job-title">${exp.position}</div>
            <div class="company">${exp.company}</div>
            <div class="date">${exp.startDate} - ${exp.endDate || 'Present'}</div>
            <p>${exp.description}</p>
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">
          ${skills.map((skill: string) => `<span class="skill">${skill}</span>`).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
}