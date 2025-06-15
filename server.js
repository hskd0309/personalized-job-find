import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mistral API configuration
const MISTRAL_API_KEY = 'mMTUkqqD5qlRC7u8mRBeXHtVTXiOaqvF';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Chatbot endpoint using Mistral
app.post('/api/chat', async (req, res) => {
  try {
    const { message, type } = req.body;

    let systemPrompt = '';
    switch (type) {
      case 'career_advice':
        systemPrompt = 'You are a career counselor specializing in the global job market. Provide helpful career advice, job search strategies, and professional development guidance.';
        break;
      case 'resume_help':
        systemPrompt = 'You are a resume expert. Help users improve their resumes, write better job descriptions, and optimize their professional profiles for global opportunities.';
        break;
      case 'interview_prep':
        systemPrompt = 'You are an interview coach. Help users prepare for job interviews, practice common questions, and improve their interview skills.';
        break;
      default:
        systemPrompt = 'You are a helpful career assistant. Provide guidance on careers, job searching, and professional development.';
    }

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message 
    });
  }
});

// Resume generation endpoint
app.post('/api/generate-resume', async (req, res) => {
  try {
    const { resumeData, templateId } = req.body;

    // Generate resume content using Mistral
    const prompt = `Generate a professional resume in clean HTML format for:
    Name: ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}
    Email: ${resumeData.personalInfo.email}
    Phone: ${resumeData.personalInfo.phone}
    Location: ${resumeData.personalInfo.location}
    Summary: ${resumeData.personalInfo.summary}
    
    Experience: ${resumeData.experience.map(exp => `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}): ${exp.description}`).join('\n')}
    
    Education: ${resumeData.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.graduationDate})${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}`).join('\n')}
    
    Skills: ${resumeData.skills.join(', ')}
    
    Create a professional, ATS-friendly resume in clean HTML format with proper CSS styling. Include:
    - Professional header with contact information
    - Clean sections for Summary, Experience, Education, and Skills
    - Proper formatting and typography
    - Print-friendly layout
    
    Return only the complete HTML document with embedded CSS.`;

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: 'You are a professional resume writer. Generate clean, ATS-friendly HTML resume content with embedded CSS styling.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 3000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const resumeHTML = data.choices[0].message.content;

    res.json({ 
      resumeHTML,
      filename: `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.html`
    });
  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate resume',
      details: error.message 
    });
  }
});

// AI resume enhancement endpoint
app.post('/api/enhance-resume', async (req, res) => {
  try {
    const { resumeData } = req.body;

    const prompt = `Enhance this resume data with professional suggestions:
    Current Experience: ${resumeData.experience.map(exp => `${exp.position} at ${exp.company}: ${exp.description}`).join('\n')}
    Current Skills: ${resumeData.skills.join(', ')}
    
    Provide actionable suggestions for:
    1. Better job descriptions with action verbs and quantified achievements
    2. Additional relevant skills to include
    3. Professional summary improvements
    4. Industry keywords for ATS optimization
    
    Return as structured JSON with enhanced content and specific recommendations.`;

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: 'You are a professional career coach and resume expert. Provide actionable suggestions to improve resumes.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const suggestions = data.choices[0].message.content;

    res.json({ suggestions });
  } catch (error) {
    console.error('Resume enhancement error:', error);
    res.status(500).json({ 
      error: 'Failed to enhance resume',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;