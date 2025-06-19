import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, template = 'standard' } = await req.json();
    
    // Generate LaTeX content based on resume-master templates
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
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

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