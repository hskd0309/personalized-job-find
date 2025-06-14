import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive skills database based on NER training data
const ALL_SKILLS = [
  // Programming Languages
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'Ruby', 'PHP', 'Swift', 'Rust', 'Dart', 'Kotlin', 'SQL', 'NoSQL', 'C', 'Scala', 'Perl', 'Haskell', 'Bash', 'Shell', 'Cobol', 'Fortran', 'Visual Basic', 'Assembly', 'Pascal', 'Ada', 'ABAP', 'RPG', 'Lisp', 'Prolog', 'F#', 'Lua', 'MATLAB', 'SAS', 'SPSS', 'R', 'Julia',
  
  // Frameworks & Libraries
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Spring Boot', 'Django', 'Flask', 'Laravel', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'React Native', 'Flutter', 'Unity', 'Unreal Engine',
  
  // Databases & Storage
  'MongoDB', 'PostgreSQL', 'MySQL', 'Oracle', 'Redis', 'Cassandra', 'Neo4j', 'HBase', 'Elasticsearch', 'Solr', 'Lucene', 'DynamoDB', 'CouchDB', 'InfluxDB',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud Platform', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'CircleCI', 'Bamboo', 'Ansible', 'Terraform', 'Chef', 'Puppet', 'Vagrant', 'Helm', 'Istio',
  
  // Data & Analytics
  'Tableau', 'Power BI', 'Apache Spark', 'Hadoop', 'Apache Kafka', 'Airflow', 'Snowflake', 'BigQuery', 'Redshift', 'ETL', 'Data Warehousing', 'Data Modeling', 'Statistical Modeling', 'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Neural Networks', 'Artificial Intelligence',
  
  // Web Technologies
  'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Webpack', 'Vite', 'Parcel', 'REST API', 'GraphQL', 'JSON', 'XML', 'SOAP', 'Microservices', 'Serverless',
  
  // Operating Systems
  'Linux', 'Unix', 'Windows', 'MacOS', 'Android', 'iOS', 'Ubuntu', 'CentOS', 'RHEL', 'Debian',
  
  // Tools & Software
  'Git', 'GitHub', 'Bitbucket', 'SVN', 'JIRA', 'Confluence', 'Slack', 'Trello', 'Asana', 'Monday.com', 'Figma', 'Sketch', 'Adobe Creative Suite', 'Photoshop', 'Illustrator', 'InDesign', 'Premiere Pro', 'After Effects',
  
  // Testing & Quality
  'JUnit', 'TestNG', 'Jest', 'Mocha', 'Cypress', 'Selenium', 'Pytest', 'Unit Testing', 'Integration Testing', 'Load Testing', 'Performance Testing', 'Automated Testing',
  
  // Security & Networking
  'Cybersecurity', 'Network Security', 'Penetration Testing', 'Ethical Hacking', 'Burp Suite', 'Wireshark', 'CCNA', 'CISSP', 'Firewall', 'VPN', 'TCP/IP', 'OSI Model', 'OSPF', 'BGP', 'Cisco', 'Routing', 'Switching',
  
  // Methodologies & Practices
  'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'Waterfall', 'SDLC', 'Object-oriented Programming', 'Functional Programming', 'Test-driven Development', 'Behavior-driven Development',
  
  // Business & Management
  'Project Management', 'Team Leadership', 'Communication', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Strategic Planning', 'Risk Management', 'Budget Management', 'Stakeholder Management', 'Change Management',
  
  // Specialized Skills
  'Blockchain', 'Cryptocurrency', 'IoT', 'Edge Computing', 'Augmented Reality', 'Virtual Reality', '3D Modeling', 'Game Development', 'Mobile Development', 'Full Stack Development', 'Frontend Development', 'Backend Development'
];

// Industry-specific keywords database
const INDUSTRY_KEYWORDS = {
  technology: ALL_SKILLS.filter(skill => 
    ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'Git', 'API', 'Agile', 'Scrum', 'Machine Learning', 'TensorFlow', 'MongoDB', 'PostgreSQL'].includes(skill)
  ),
  marketing: ['SEO', 'SEM', 'Google Analytics', 'Facebook Ads', 'Content Marketing', 'Brand Management', 'ROI', 'CRM', 'Social Media Marketing', 'Email Marketing', 'PPC', 'Conversion Optimization'],
  finance: ['Financial Analysis', 'Excel', 'SQL', 'Risk Management', 'Compliance', 'Audit', 'Forecasting', 'Budgeting', 'Financial Modeling', 'Bloomberg Terminal', 'QuickBooks', 'SAP'],
  design: ['Adobe Creative Suite', 'Figma', 'Sketch', 'UI/UX', 'Prototyping', 'User Research', 'Wireframing', 'Photoshop', 'Illustrator', 'InDesign', 'User Experience Design'],
  sales: ['CRM', 'Lead Generation', 'Sales Funnel', 'Negotiation', 'Client Relations', 'Revenue Growth', 'Prospecting', 'Salesforce', 'HubSpot', 'Cold Calling', 'Account Management'],
  general: ['Leadership', 'Communication', 'Problem Solving', 'Team Management', 'Project Management', 'Time Management', 'Critical Thinking', 'Strategic Planning']
};

// Common action verbs for strong resume language
const ACTION_VERBS = [
  'achieved', 'managed', 'led', 'developed', 'improved', 'increased', 'decreased', 'optimized',
  'implemented', 'designed', 'created', 'built', 'established', 'launched', 'delivered',
  'coordinated', 'supervised', 'trained', 'mentored', 'analyzed', 'researched', 'presented'
];

// Grammar patterns to check
const GRAMMAR_ISSUES = [
  /\bi\b/gi, // lowercase "i"
  /\s{2,}/g, // multiple spaces
  /[.]{2,}/g, // multiple periods
  /[,]{2,}/g, // multiple commas
];

function analyzeGrammar(text: string): number {
  let score = 100;
  const words = text.split(/\s+/).length;
  
  // Check for grammar issues
  GRAMMAR_ISSUES.forEach(pattern => {
    const matches = text.match(pattern) || [];
    score -= matches.length * 2; // Deduct 2 points per issue
  });
  
  // Check for spelling consistency (basic patterns)
  const spellingIssues = text.match(/\b[a-z]+[A-Z][a-z]*\b/g) || [];
  score -= spellingIssues.length * 3;
  
  // Check for proper sentence structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = words / sentences.length;
  
  if (avgWordsPerSentence > 25) score -= 10; // Too long sentences
  if (avgWordsPerSentence < 8) score -= 5; // Too short sentences
  
  return Math.max(0, Math.min(100, score));
}

function analyzeFormatting(text: string): number {
  let score = 100;
  
  // Check for consistent formatting patterns
  const hasHeaders = /^[A-Z\s]+$/m.test(text);
  if (!hasHeaders) score -= 15;
  
  // Check for bullet points or consistent structure
  const hasBullets = /^[\s]*[-•*]\s+/m.test(text);
  const hasNumbers = /^\d+\.\s+/m.test(text);
  if (!hasBullets && !hasNumbers) score -= 10;
  
  // Check for contact information structure
  const hasEmail = /@[\w.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  if (!hasEmail) score -= 15;
  if (!hasPhone) score -= 10;
  
  // Check for date formatting consistency
  const dates = text.match(/\b(19|20)\d{2}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g) || [];
  if (dates.length > 0) {
    const inconsistentDates = new Set(dates.map(d => d.replace(/\d/g, '#'))).size;
    if (inconsistentDates > 2) score -= 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

function analyzeKeywords(text: string, skills: string[]): number {
  let score = 50; // Base score
  const textLower = text.toLowerCase();
  
  // Check for action verbs
  const actionVerbCount = ACTION_VERBS.filter(verb => 
    textLower.includes(verb)
  ).length;
  score += Math.min(20, actionVerbCount * 2);
  
  // Check for quantifiable achievements
  const numbers = text.match(/\d+[\%\$\+]?|\$\d+|[\d,]+\s*(million|thousand|k\b)/gi) || [];
  score += Math.min(15, numbers.length * 3);
  
  // Check for industry keywords
  let industryMatches = 0;
  Object.values(INDUSTRY_KEYWORDS).forEach(keywords => {
    keywords.forEach(keyword => {
      if (textLower.includes(keyword.toLowerCase())) {
        industryMatches++;
      }
    });
  });
  score += Math.min(15, industryMatches * 2);
  
  return Math.max(0, Math.min(100, score));
}

function analyzeATS(text: string): number {
  let score = 100;
  
  // Check for ATS-friendly formatting
  const hasComplexFormatting = /[{}|<>]/.test(text);
  if (hasComplexFormatting) score -= 20;
  
  // Check for standard section headers
  const standardSections = ['experience', 'education', 'skills', 'summary', 'objective'];
  const foundSections = standardSections.filter(section => 
    new RegExp(section, 'i').test(text)
  ).length;
  score += foundSections * 5;
  
  // Check for keyword density (not too sparse, not stuffed)
  const words = text.split(/\s+/).length;
  const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
  const keywordDensity = uniqueWords / words;
  
  if (keywordDensity < 0.4) score -= 15; // Too repetitive
  if (keywordDensity > 0.8) score -= 10; // Too sparse
  
  return Math.max(0, Math.min(100, score));
}

function generateImprovements(text: string, scores: any): string[] {
  const improvements = [];
  
  if (scores.grammar < 80) {
    improvements.push("Review and correct grammar errors, especially capitalization and punctuation");
  }
  
  if (scores.formatting < 70) {
    improvements.push("Use consistent formatting with clear section headers and bullet points");
    improvements.push("Include complete contact information with professional email and phone number");
  }
  
  if (scores.keywords < 60) {
    improvements.push("Add more action verbs to describe your achievements (managed, led, improved, etc.)");
    improvements.push("Include quantifiable metrics and numbers to demonstrate impact");
  }
  
  if (scores.ats < 70) {
    improvements.push("Use standard section headings like 'Work Experience' and 'Education'");
    improvements.push("Avoid complex formatting, tables, and special characters");
  }
  
  // General improvements
  if (!text.toLowerCase().includes('achieved') && !text.toLowerCase().includes('improved')) {
    improvements.push("Highlight specific achievements and results rather than just listing responsibilities");
  }
  
  return improvements.slice(0, 6); // Limit to top 6 improvements
}

function generateMissingSkills(text: string): string[] {
  const textLower = text.toLowerCase();
  const missing = [];
  
  // Check for general professional skills
  const generalSkills = INDUSTRY_KEYWORDS.general;
  generalSkills.forEach(skill => {
    if (!textLower.includes(skill.toLowerCase())) {
      missing.push(skill);
    }
  });
  
  // Add industry-specific suggestions based on content
  if (textLower.includes('software') || textLower.includes('developer')) {
    INDUSTRY_KEYWORDS.technology.forEach(skill => {
      if (!textLower.includes(skill.toLowerCase()) && missing.length < 8) {
        missing.push(skill);
      }
    });
  }
  
  return missing.slice(0, 6);
}

// Extract skills from text based on comprehensive NER training data
function extractSkills(text: string): string[] {
  const textLower = text.toLowerCase();
  const extractedSkills = new Set<string>();
  
  // Direct skill matching (case-insensitive)
  ALL_SKILLS.forEach(skill => {
    const skillLower = skill.toLowerCase();
    const skillPattern = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (skillPattern.test(text)) {
      extractedSkills.add(skill);
    }
  });
  
  // Pattern-based skill extraction for variations
  const skillVariations = {
    'JavaScript': ['js', 'javascript', 'ecmascript'],
    'TypeScript': ['ts', 'typescript'],
    'Node.js': ['nodejs', 'node js', 'node.js'],
    'React': ['reactjs', 'react.js'],
    'Angular': ['angularjs', 'angular.js'],
    'Vue.js': ['vuejs', 'vue js'],
    'Machine Learning': ['ml', 'machine learning', 'artificial intelligence', 'ai'],
    'Deep Learning': ['dl', 'deep learning', 'neural networks'],
    'Natural Language Processing': ['nlp', 'natural language processing'],
    'Computer Vision': ['cv', 'computer vision', 'image processing'],
    'Amazon Web Services': ['aws', 'amazon web services'],
    'Google Cloud Platform': ['gcp', 'google cloud'],
    'Microsoft Azure': ['azure', 'microsoft azure'],
    'Continuous Integration': ['ci', 'continuous integration'],
    'Continuous Deployment': ['cd', 'continuous deployment'],
    'Test-Driven Development': ['tdd', 'test driven development'],
    'Object-Oriented Programming': ['oop', 'object oriented'],
    'User Experience': ['ux', 'user experience'],
    'User Interface': ['ui', 'user interface'],
    'Application Programming Interface': ['api', 'rest api', 'restful api'],
    'Structured Query Language': ['sql', 'structured query language'],
    'HyperText Markup Language': ['html', 'html5'],
    'Cascading Style Sheets': ['css', 'css3'],
    'Search Engine Optimization': ['seo', 'search engine optimization']
  };
  
  Object.entries(skillVariations).forEach(([mainSkill, variations]) => {
    variations.forEach(variation => {
      const pattern = new RegExp(`\\b${variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (pattern.test(text)) {
        extractedSkills.add(mainSkill);
      }
    });
  });
  
  return Array.from(extractedSkills).slice(0, 20); // Limit to top 20 skills
}

// Extract experience years from text
function extractExperienceYears(text: string): number {
  const experiencePatterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/gi,
    /(\d+)\+?\s*years?\s*(?:in|with|using)/gi,
    /(\d+)\+?\s*yrs?\s*(?:of\s*)?(?:experience|exp)/gi,
    /experience\s*:?\s*(\d+)\+?\s*years?/gi,
    /(\d+)\+?\s*years?\s*professional/gi
  ];
  
  const matches = [];
  experiencePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      matches.push(parseInt(match[1]));
    }
  });
  
  // Return the maximum years found, or estimate based on job positions
  if (matches.length > 0) {
    return Math.max(...matches);
  }
  
  // Fallback: estimate from job positions mentioned
  const jobTitles = text.match(/(?:senior|lead|principal|director|manager|head of|chief)/gi) || [];
  if (jobTitles.length > 0) {
    return 5; // Assume senior roles require at least 5 years
  }
  
  const juniorTitles = text.match(/(?:junior|entry|intern|graduate|trainee)/gi) || [];
  if (juniorTitles.length > 0) {
    return 1; // Assume junior roles are 1+ years
  }
  
  return 2; // Default estimate
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, skills, experience } = await req.json();
    
    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('Resume text is required for analysis');
    }

    console.log('Analyzing resume with NLP-based analyzer...');
    
    // Extract skills and experience using NLP
    const extractedSkills = extractSkills(resumeText);
    const experienceYears = extractExperienceYears(resumeText);
    
    // Perform analysis using rule-based NLP
    const grammarScore = analyzeGrammar(resumeText);
    const formattingScore = analyzeFormatting(resumeText);
    const keywordScore = analyzeKeywords(resumeText, skills || []);
    const atsScore = analyzeATS(resumeText);
    
    // Calculate overall score as weighted average
    const overallScore = Math.round(
      (grammarScore * 0.2 + formattingScore * 0.25 + keywordScore * 0.3 + atsScore * 0.25)
    );
    
    const scores = { grammar: grammarScore, formatting: formattingScore, keywords: keywordScore, ats: atsScore };
    
    // Format response to match frontend expectations
    const analysis = {
      // Main fields expected by frontend
      score: overallScore,
      feedback: `Your resume scored ${overallScore}/100. ${overallScore >= 80 ? 'Excellent work! Your resume is well-optimized.' : overallScore >= 60 ? 'Good foundation with room for improvement.' : 'Significant improvements needed to compete effectively.'} Focus on the specific recommendations above to enhance your job prospects.`,
      extractedSkills: extractedSkills,
      experienceYears: experienceYears,
      suggestions: generateImprovements(resumeText, scores),
      strengths: [
        grammarScore > 80 ? "Good grammar and writing quality" : null,
        formattingScore > 80 ? "Well-structured formatting" : null,
        keywordScore > 70 ? "Good use of industry keywords" : null,
        atsScore > 80 ? "ATS-friendly structure" : null
      ].filter(Boolean),
      weaknesses: [
        grammarScore < 60 ? "Grammar and spelling need improvement" : null,
        formattingScore < 60 ? "Inconsistent formatting and structure" : null,
        keywordScore < 50 ? "Lacks impactful keywords and metrics" : null,
        atsScore < 60 ? "Not optimized for ATS systems" : null
      ].filter(Boolean),
      
      // Additional detailed fields for ResumeAnalyzerPage
      overallScore,
      grammarScore,
      formattingScore,
      keywordScore,
      atsScore,
      improvements: generateImprovements(resumeText, scores),
      missingSkills: generateMissingSkills(resumeText),
      atsStrategies: [
        "Use standard section headings like 'Experience' and 'Education'",
        "Avoid complex formatting, tables, and graphics",
        "Include keywords from the job description verbatim",
        "Use a single-column layout for better parsing",
        "Save as a simple .docx or .pdf format"
      ],
      industryTips: [
        "Research industry-specific terminology for your field",
        "Highlight certifications and relevant training prominently",
        "Include relevant projects and their measurable outcomes",
        "Use LinkedIn to find keywords from similar job postings",
        "Tailor your resume for each specific job application"
      ]
    };

    console.log('Analysis completed successfully:', { 
      overallScore, 
      extractedSkills: extractedSkills.length, 
      experienceYears,
      grammarScore, 
      formattingScore, 
      keywordScore, 
      atsScore 
    });

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in resume-analyzer function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze resume', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});