export interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  description: string;
  template: string;
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'professional',
    name: 'Professional',
    category: 'Classic',
    preview: '/templates/professional.jpg',
    description: 'Clean and professional design perfect for corporate roles',
    template: `
      <div class="resume-template professional">
        <header class="header">
          <h1>{{firstName}} {{lastName}}</h1>
          <div class="contact-info">
            <span>{{email}}</span> | <span>{{phone}}</span> | <span>{{location}}</span>
          </div>
        </header>
        <section class="summary">
          <h2>Professional Summary</h2>
          <p>{{summary}}</p>
        </section>
        <section class="experience">
          <h2>Experience</h2>
          {{#each experience}}
          <div class="job">
            <h3>{{position}}</h3>
            <div class="company">{{company}} | {{location}}</div>
            <div class="dates">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            <p>{{description}}</p>
          </div>
          {{/each}}
        </section>
        <section class="education">
          <h2>Education</h2>
          {{#each education}}
          <div class="school">
            <h3>{{degree}}</h3>
            <div>{{institution}} | {{location}}</div>
            <div>{{startDate}} - {{endDate}}</div>
          </div>
          {{/each}}
        </section>
        <section class="skills">
          <h2>Skills</h2>
          <div class="skills-list">
            {{#each skills}}<span class="skill">{{this}}</span>{{/each}}
          </div>
        </section>
      </div>
    `
  },
  {
    id: 'modern',
    name: 'Modern',
    category: 'Contemporary',
    preview: '/templates/modern.jpg',
    description: 'Contemporary design with accent colors and modern layout',
    template: `
      <div class="resume-template modern">
        <div class="sidebar">
          <div class="profile">
            <h1>{{firstName}}<br>{{lastName}}</h1>
            <div class="contact">
              <div>{{email}}</div>
              <div>{{phone}}</div>
              <div>{{location}}</div>
            </div>
          </div>
          <section class="skills">
            <h2>Skills</h2>
            {{#each skills}}<div class="skill-item">{{this}}</div>{{/each}}
          </section>
        </div>
        <div class="main-content">
          <section class="summary">
            <h2>About Me</h2>
            <p>{{summary}}</p>
          </section>
          <section class="experience">
            <h2>Experience</h2>
            {{#each experience}}
            <div class="job">
              <h3>{{position}}</h3>
              <div class="meta">{{company}} | {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
              <p>{{description}}</p>
            </div>
            {{/each}}
          </section>
          <section class="education">
            <h2>Education</h2>
            {{#each education}}
            <div class="school">
              <h3>{{degree}}</h3>
              <div>{{institution}} | {{startDate}} - {{endDate}}</div>
            </div>
            {{/each}}
          </section>
        </div>
      </div>
    `
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'Design',
    preview: '/templates/creative.jpg',
    description: 'Bold and colorful design perfect for creative professionals',
    template: `
      <div class="resume-template creative">
        <header class="creative-header">
          <div class="name-section">
            <h1>{{firstName}} {{lastName}}</h1>
            <div class="tagline">Creative Professional</div>
          </div>
          <div class="contact-section">
            <div>{{email}}</div>
            <div>{{phone}}</div>
            <div>{{location}}</div>
          </div>
        </header>
        <div class="content-grid">
          <div class="left-column">
            <section class="summary">
              <h2>Summary</h2>
              <p>{{summary}}</p>
            </section>
            <section class="skills">
              <h2>Skills</h2>
              <div class="skills-grid">
                {{#each skills}}<span class="skill-tag">{{this}}</span>{{/each}}
              </div>
            </section>
          </div>
          <div class="right-column">
            <section class="experience">
              <h2>Experience</h2>
              {{#each experience}}
              <div class="job-card">
                <h3>{{position}}</h3>
                <div class="company-info">{{company}} | {{location}}</div>
                <div class="date-range">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
                <p>{{description}}</p>
              </div>
              {{/each}}
            </section>
            <section class="education">
              <h2>Education</h2>
              {{#each education}}
              <div class="education-item">
                <h3>{{degree}}</h3>
                <div>{{institution}}</div>
                <div>{{startDate}} - {{endDate}}</div>
              </div>
              {{/each}}
            </section>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'Simple',
    preview: '/templates/minimal.jpg',
    description: 'Clean and simple layout with maximum readability',
    template: `
      <div class="resume-template minimal">
        <header class="minimal-header">
          <h1>{{firstName}} {{lastName}}</h1>
          <div class="contact-line">{{email}} • {{phone}} • {{location}}</div>
        </header>
        
        <section class="section">
          <h2>Summary</h2>
          <p>{{summary}}</p>
        </section>
        
        <section class="section">
          <h2>Experience</h2>
          {{#each experience}}
          <div class="entry">
            <div class="entry-header">
              <strong>{{position}}</strong> — {{company}}
              <span class="date">{{startDate}} – {{#if current}}Present{{else}}{{endDate}}{{/if}}</span>
            </div>
            <p>{{description}}</p>
          </div>
          {{/each}}
        </section>
        
        <section class="section">
          <h2>Education</h2>
          {{#each education}}
          <div class="entry">
            <div class="entry-header">
              <strong>{{degree}}</strong> — {{institution}}
              <span class="date">{{startDate}} – {{endDate}}</span>
            </div>
          </div>
          {{/each}}
        </section>
        
        <section class="section">
          <h2>Skills</h2>
          <p>{{#each skills}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</p>
        </section>
      </div>
    `
  },
  {
    id: 'executive',
    name: 'Executive',
    category: 'Professional',
    preview: '/templates/executive.jpg',
    description: 'Sophisticated design perfect for senior leadership roles',
    template: `
      <div class="resume-template executive">
        <header class="executive-header">
          <div class="name-title">
            <h1>{{firstName}} {{lastName}}</h1>
            <div class="title">Senior Executive</div>
          </div>
          <div class="contact-info">
            <div>{{email}}</div>
            <div>{{phone}}</div>
            <div>{{location}}</div>
          </div>
        </header>
        
        <section class="executive-summary">
          <h2>Executive Summary</h2>
          <p>{{summary}}</p>
        </section>
        
        <section class="professional-experience">
          <h2>Professional Experience</h2>
          {{#each experience}}
          <div class="position">
            <div class="position-header">
              <h3>{{position}}</h3>
              <div class="company-date">{{company}} | {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            </div>
            <div class="location">{{location}}</div>
            <p>{{description}}</p>
          </div>
          {{/each}}
        </section>
        
        <div class="bottom-sections">
          <section class="education">
            <h2>Education</h2>
            {{#each education}}
            <div class="degree">
              <strong>{{degree}}</strong><br>
              {{institution}}, {{location}}<br>
              {{startDate}} - {{endDate}}
            </div>
            {{/each}}
          </section>
          
          <section class="core-competencies">
            <h2>Core Competencies</h2>
            <div class="competencies-grid">
              {{#each skills}}<div class="competency">{{this}}</div>{{/each}}
            </div>
          </section>
        </div>
      </div>
    `
  },
  {
    id: 'tech',
    name: 'Tech Focus',
    category: 'Industry',
    preview: '/templates/tech.jpg',
    description: 'Optimized layout for technology professionals with skills emphasis',
    template: `
      <div class="resume-template tech">
        <header class="tech-header">
          <h1>{{firstName}} {{lastName}}</h1>
          <div class="role">Software Engineer</div>
          <div class="contact">{{email}} | {{phone}} | {{location}}</div>
        </header>
        
        <div class="tech-layout">
          <div class="main-content">
            <section class="summary">
              <h2>About</h2>
              <p>{{summary}}</p>
            </section>
            
            <section class="experience">
              <h2>Experience</h2>
              {{#each experience}}
              <div class="job">
                <div class="job-title">
                  <h3>{{position}}</h3>
                  <span class="company">{{company}}</span>
                </div>
                <div class="job-meta">{{location}} | {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
                <div class="job-description">{{description}}</div>
              </div>
              {{/each}}
            </section>
            
            <section class="education">
              <h2>Education</h2>
              {{#each education}}
              <div class="education-item">
                <h3>{{degree}}</h3>
                <div>{{institution}} | {{startDate}} - {{endDate}}</div>
              </div>
              {{/each}}
            </section>
          </div>
          
          <div class="sidebar">
            <section class="skills">
              <h2>Technical Skills</h2>
              <div class="skill-categories">
                {{#each skills}}
                <div class="skill-item">{{this}}</div>
                {{/each}}
              </div>
            </section>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'academic',
    name: 'Academic',
    category: 'Specialized',
    preview: '/templates/academic.jpg',
    description: 'Perfect for academic and research positions with publication focus',
    template: `
      <div class="resume-template academic">
        <header class="academic-header">
          <h1>{{firstName}} {{lastName}}</h1>
          <div class="credentials">Ph.D.</div>
          <div class="contact">
            {{email}} | {{phone}}<br>
            {{location}}
          </div>
        </header>
        
        <section class="research-interests">
          <h2>Research Interests</h2>
          <p>{{summary}}</p>
        </section>
        
        <section class="education">
          <h2>Education</h2>
          {{#each education}}
          <div class="degree-item">
            <h3>{{degree}}</h3>
            <div class="institution">{{institution}}, {{location}}</div>
            <div class="date">{{startDate}} - {{endDate}}</div>
          </div>
          {{/each}}
        </section>
        
        <section class="experience">
          <h2>Academic & Professional Experience</h2>
          {{#each experience}}
          <div class="position">
            <h3>{{position}}</h3>
            <div class="institution">{{company}}, {{location}}</div>
            <div class="date">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            <p>{{description}}</p>
          </div>
          {{/each}}
        </section>
        
        <section class="skills">
          <h2>Skills & Expertise</h2>
          <div class="skills-list">
            {{#each skills}}<span class="skill">{{this}}</span>{{/each}}
          </div>
        </section>
      </div>
    `
  },
  {
    id: 'marketing',
    name: 'Marketing Pro',
    category: 'Industry',
    preview: '/templates/marketing.jpg',
    description: 'Eye-catching design perfect for marketing professionals',
    template: `
      <div class="resume-template marketing">
        <header class="marketing-header">
          <div class="brand-section">
            <h1>{{firstName}} {{lastName}}</h1>
            <div class="brand-tagline">Marketing Professional</div>
          </div>
          <div class="contact-section">
            <div class="contact-item">{{email}}</div>
            <div class="contact-item">{{phone}}</div>
            <div class="contact-item">{{location}}</div>
          </div>
        </header>
        
        <section class="brand-statement">
          <h2>Brand Statement</h2>
          <p>{{summary}}</p>
        </section>
        
        <section class="experience">
          <h2>Professional Experience</h2>
          {{#each experience}}
          <div class="role">
            <div class="role-header">
              <h3>{{position}}</h3>
              <div class="company-period">{{company}} | {{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}}</div>
            </div>
            <div class="achievements">{{description}}</div>
          </div>
          {{/each}}
        </section>
        
        <div class="bottom-row">
          <section class="education">
            <h2>Education</h2>
            {{#each education}}
            <div class="education-entry">
              <strong>{{degree}}</strong><br>
              {{institution}}<br>
              {{startDate}} - {{endDate}}
            </div>
            {{/each}}
          </section>
          
          <section class="skills">
            <h2>Core Skills</h2>
            <div class="skills-grid">
              {{#each skills}}<div class="skill-badge">{{this}}</div>{{/each}}
            </div>
          </section>
        </div>
      </div>
    `
  },
  {
    id: 'sales',
    name: 'Sales Expert',
    category: 'Industry',
    preview: '/templates/sales.jpg',
    description: 'Results-focused design perfect for sales professionals',
    template: `
      <div class="resume-template sales">
        <header class="sales-header">
          <h1>{{firstName}} {{lastName}}</h1>
          <div class="value-proposition">Sales Professional</div>
          <div class="contact-bar">
            {{email}} • {{phone}} • {{location}}
          </div>
        </header>
        
        <section class="value-statement">
          <h2>Value Statement</h2>
          <p>{{summary}}</p>
        </section>
        
        <section class="sales-experience">
          <h2>Sales Experience</h2>
          {{#each experience}}
          <div class="sales-role">
            <div class="role-title">
              <h3>{{position}}</h3>
              <span class="company">{{company}}</span>
            </div>
            <div class="tenure">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}} | {{location}}</div>
            <div class="achievements">
              <p>{{description}}</p>
            </div>
          </div>
          {{/each}}
        </section>
        
        <div class="sidebar-content">
          <section class="education">
            <h2>Education</h2>
            {{#each education}}
            <div class="education-block">
              <strong>{{degree}}</strong><br>
              {{institution}}<br>
              {{startDate}} - {{endDate}}
            </div>
            {{/each}}
          </section>
          
          <section class="core-skills">
            <h2>Core Skills</h2>
            <ul class="skills-list">
              {{#each skills}}<li>{{this}}</li>{{/each}}
            </ul>
          </section>
        </div>
      </div>
    `
  },
  {
    id: 'startup',
    name: 'Startup',
    category: 'Contemporary',
    preview: '/templates/startup.jpg',
    description: 'Dynamic design perfect for startup environments and entrepreneurs',
    template: `
      <div class="resume-template startup">
        <header class="startup-header">
          <div class="personal-brand">
            <h1>{{firstName}} {{lastName}}</h1>
            <div class="role-badge">Startup Professional</div>
          </div>
          <div class="contact-links">
            <div>📧 {{email}}</div>
            <div>📱 {{phone}}</div>
            <div>📍 {{location}}</div>
          </div>
        </header>
        
        <section class="mission-statement">
          <h2>🚀 Mission Statement</h2>
          <p>{{summary}}</p>
        </section>
        
        <section class="journey">
          <h2>🛣️ Professional Journey</h2>
          {{#each experience}}
          <div class="milestone">
            <div class="milestone-header">
              <h3>{{position}}</h3>
              <div class="company-tag">{{company}}</div>
            </div>
            <div class="timeline">{{startDate}} - {{#if current}}Present{{else}}{{endDate}}{{/if}} • {{location}}</div>
            <div class="impact">{{description}}</div>
          </div>
          {{/each}}
        </section>
        
        <div class="skills-education">
          <section class="superpowers">
            <h2>⚡ Superpowers</h2>
            <div class="powers-grid">
              {{#each skills}}<span class="power">{{this}}</span>{{/each}}
            </div>
          </section>
          
          <section class="education">
            <h2>🎓 Education</h2>
            {{#each education}}
            <div class="learning">
              <strong>{{degree}}</strong><br>
              {{institution}}<br>
              {{startDate}} - {{endDate}}
            </div>
            {{/each}}
          </section>
        </div>
      </div>
    `
  }
];

export const templateCategories = [
  'All Templates',
  'Classic',
  'Contemporary',
  'Creative',
  'Professional',
  'Industry',
  'Specialized',
  'Simple'
];