export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  category: string;
  skills: string[];
  companyRating: number;
  companyReviews: number;
}

export interface Company {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  description: string;
  size: string;
  industry: string;
  headquarters: string;
  website: string;
  benefits: string[];
  culture: string[];
}

// Generate 50 diverse global companies
export const companies: Company[] = Array.from({ length: 50 }, (_, i) => {
  const companyNames = [
    'TechCorp Solutions', 'DataFlow Analytics', 'CloudNine Systems', 'FinTech Innovations', 'GreenEnergy Solutions',
    'Microsoft', 'Google', 'Amazon', 'Apple', 'Meta', 'Tesla', 'Netflix', 'Adobe', 'Salesforce', 'Oracle',
    'IBM', 'Intel', 'NVIDIA', 'Cisco', 'VMware', 'Spotify', 'Airbnb', 'Uber', 'PayPal', 'Square',
    'Stripe', 'Shopify', 'Zoom', 'Slack', 'Dropbox', 'Atlassian', 'ServiceNow', 'Workday', 'Palantir', 'Snowflake',
    'CrowdStrike', 'Datadog', 'MongoDB', 'Elastic', 'Twillio', 'Okta', 'Unity', 'Roblox', 'Discord', 'Reddit',
    'Twitter', 'LinkedIn', 'Pinterest', 'Snapchat', 'TikTok'
  ];

  const industries = [
    'Technology', 'Cloud Computing', 'Financial Technology', 'Analytics', 'Clean Energy',
    'E-commerce', 'Entertainment', 'Social Media', 'Gaming', 'Enterprise Software',
    'Cybersecurity', 'Database', 'Communications', 'Transportation', 'Real Estate'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
    'London, UK', 'Berlin, Germany', 'Amsterdam, Netherlands', 'Toronto, Canada', 'Sydney, Australia',
    'Singapore', 'Tokyo, Japan', 'Tel Aviv, Israel', 'Stockholm, Sweden', 'Dublin, Ireland'
  ];

  const sizes = ['50-200', '200-1000', '1000-5000', '5000-10000', '10000+'];
  const benefits = [
    ['Health Insurance', 'Remote Work', '401k', 'Flexible Hours'],
    ['Health Insurance', 'Stock Options', 'Learning Budget', 'Gym Membership'],
    ['Health Insurance', 'Unlimited PTO', 'Remote Work', 'Professional Development'],
    ['Health Insurance', 'Bonus Structure', 'Stock Options', 'Flexible Schedule'],
    ['Health Insurance', 'Wellness Programs', 'Career Development', 'Team Events']
  ];

  const cultures = [
    ['Innovation-driven', 'Collaborative', 'Work-life balance'],
    ['Data-driven', 'Fast-paced', 'Results-oriented'],
    ['Innovation', 'Autonomy', 'Continuous learning'],
    ['Fast-paced', 'Innovation', 'Competitive'],
    ['Purpose-driven', 'Sustainability', 'Innovation']
  ];

  return {
    id: (i + 1).toString(),
    name: companyNames[i],
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 500) + 50,
    description: `Leading ${industries[i % industries.length].toLowerCase()} company delivering innovative solutions globally.`,
    size: sizes[i % sizes.length],
    industry: industries[i % industries.length],
    headquarters: locations[i % locations.length],
    website: `${companyNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
    benefits: benefits[i % benefits.length],
    culture: cultures[i % cultures.length]
  };
});

// Generate 100+ diverse jobs programmatically
export const jobs: Job[] = Array.from({ length: 100 }, (_, i) => {
  const jobTitles = [
    'Senior Frontend Developer', 'Data Scientist', 'DevOps Engineer', 'UX/UI Designer', 'Backend Developer',
    'Full Stack Developer', 'Product Manager', 'Software Engineer', 'Marketing Specialist', 'Sales Representative',
    'HR Business Partner', 'Financial Analyst', 'Customer Success Manager', 'Quality Assurance Engineer',
    'Mobile Developer', 'Cloud Architect', 'Cybersecurity Analyst', 'Technical Writer', 'Business Analyst',
    'Project Manager', 'Machine Learning Engineer', 'Database Administrator', 'System Administrator',
    'Security Engineer', 'Site Reliability Engineer', 'Software Architect', 'Lead Developer',
    'Principal Engineer', 'Engineering Manager', 'Technical Lead', 'Solutions Architect',
    'Platform Engineer', 'Infrastructure Engineer', 'Application Developer', 'Web Developer',
    'API Developer', 'Blockchain Developer', 'AI Engineer', 'Research Scientist', 'Data Engineer',
    'Analytics Engineer', 'Growth Hacker', 'Digital Marketing Manager', 'Content Marketing Manager',
    'Social Media Manager', 'SEO Specialist', 'PPC Specialist', 'Email Marketing Specialist',
    'Brand Manager', 'Product Marketing Manager', 'Sales Development Representative', 'Account Executive',
    'Customer Support Manager', 'Operations Manager', 'Finance Manager', 'Legal Counsel',
    'Compliance Officer', 'Risk Analyst', 'Investment Analyst', 'Portfolio Manager', 'Trader',
    'Consultant', 'Strategy Consultant', 'Management Consultant', 'Technology Consultant',
    'Designer', 'Graphic Designer', 'Creative Director', 'Art Director', 'Copywriter',
    'Content Creator', 'Video Editor', 'Photographer', 'Animator', '3D Artist',
    'Game Developer', 'Game Designer', 'Level Designer', 'Character Artist', 'Technical Artist',
    'QA Tester', 'Automation Tester', 'Performance Tester', 'Security Tester', 'Usability Tester',
    'Scrum Master', 'Agile Coach', 'Release Manager', 'Change Manager', 'Training Manager'
  ];

  const categories = [
    'Technology', 'Data Science', 'Design', 'Marketing', 'Sales', 'Finance', 'Healthcare',
    'Education', 'Consulting', 'Gaming', 'Entertainment', 'E-commerce', 'Fintech', 'AI/ML'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
    'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Portland, OR', 'Atlanta, GA',
    'London, UK', 'Berlin, Germany', 'Amsterdam, Netherlands', 'Toronto, Canada', 'Sydney, Australia',
    'Singapore', 'Tokyo, Japan', 'Tel Aviv, Israel', 'Stockholm, Sweden', 'Dublin, Ireland',
    'Remote', 'Hybrid'
  ];

  const types: ('full-time' | 'part-time' | 'contract' | 'remote')[] = ['full-time', 'part-time', 'contract', 'remote'];
  
  const skills = [
    ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow'],
    ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
    ['Figma', 'User Research', 'Prototyping', 'Adobe Creative Suite', 'HTML/CSS'],
    ['Node.js', 'PostgreSQL', 'MongoDB', 'REST APIs', 'Microservices'],
    ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka'],
    ['Vue.js', 'Angular', 'GraphQL', 'Firebase', 'Netlify'],
    ['Flutter', 'Swift', 'Kotlin', 'React Native', 'Xamarin'],
    ['C#', '.NET', 'Azure', 'Entity Framework', 'SignalR'],
    ['Go', 'Rust', 'Scala', 'Erlang', 'Haskell']
  ];

  const requirements = [
    ['5+ years experience', 'Strong communication skills', 'Team player', 'Problem-solving skills'],
    ['Bachelor\'s degree', 'Relevant certifications', 'Portfolio required', 'Remote work experience'],
    ['Agile methodology', 'CI/CD experience', 'Cloud platforms', 'Testing frameworks'],
    ['Leadership experience', 'Project management', 'Stakeholder management', 'Budget management'],
    ['Customer-facing experience', 'Sales experience', 'CRM tools', 'Presentation skills']
  ];

  const benefits = [
    ['Health Insurance', 'Stock Options', 'Remote Work', 'Professional Development'],
    ['Unlimited PTO', 'Flexible Hours', 'Learning Budget', 'Gym Membership'],
    ['401k Match', 'Dental & Vision', 'Life Insurance', 'Commuter Benefits'],
    ['Parental Leave', 'Mental Health Support', 'Wellness Programs', 'Team Events'],
    ['Conference Budget', 'Equipment Allowance', 'Home Office Setup', 'Sabbatical']
  ];

  const title = jobTitles[i % jobTitles.length];
  const company = companies[i % companies.length];
  const salaryMin = 50000 + Math.floor(Math.random() * 100000);
  const salaryMax = salaryMin + 20000 + Math.floor(Math.random() * 50000);

  return {
    id: (i + 1).toString(),
    title,
    company: company.name,
    location: locations[i % locations.length],
    type: types[i % types.length],
    salary: `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`,
    experience: `${1 + Math.floor(Math.random() * 7)}+ years`,
    description: `Join our team as a ${title}. We're looking for talented individuals to help us build the future of ${categories[i % categories.length].toLowerCase()}. This role offers excellent growth opportunities and the chance to work with cutting-edge technology.`,
    requirements: requirements[i % requirements.length],
    benefits: benefits[i % benefits.length],
    postedDate: `2024-06-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`,
    category: categories[i % categories.length],
    skills: skills[i % skills.length],
    companyRating: company.rating,
    companyReviews: company.reviewCount
  };
});

export const allJobs = jobs;