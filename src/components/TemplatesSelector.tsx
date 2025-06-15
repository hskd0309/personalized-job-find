import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const resumeTemplates = [
  { id: 'classic-blue', name: 'Classic Blue', color: 'bg-blue-500', preview: 'Professional blue header with clean layout' },
  { id: 'modern-green', name: 'Modern Green', color: 'bg-green-500', preview: 'Contemporary green design with sidebar' },
  { id: 'elegant-purple', name: 'Elegant Purple', color: 'bg-purple-500', preview: 'Sophisticated purple theme' },
  { id: 'creative-orange', name: 'Creative Orange', color: 'bg-orange-500', preview: 'Bold orange creative layout' },
  { id: 'minimal-gray', name: 'Minimal Gray', color: 'bg-gray-500', preview: 'Clean minimalist design' },
  { id: 'tech-teal', name: 'Tech Teal', color: 'bg-teal-500', preview: 'Technology-focused teal theme' },
  { id: 'executive-navy', name: 'Executive Navy', color: 'bg-slate-700', preview: 'Professional navy for executives' },
  { id: 'artistic-pink', name: 'Artistic Pink', color: 'bg-pink-500', preview: 'Creative pink design' },
  { id: 'corporate-red', name: 'Corporate Red', color: 'bg-red-500', preview: 'Bold corporate red theme' },
  { id: 'fresh-lime', name: 'Fresh Lime', color: 'bg-lime-500', preview: 'Vibrant lime green layout' },
  { id: 'royal-indigo', name: 'Royal Indigo', color: 'bg-indigo-500', preview: 'Regal indigo design' },
  { id: 'sunset-amber', name: 'Sunset Amber', color: 'bg-amber-500', preview: 'Warm amber sunset theme' },
  { id: 'ocean-cyan', name: 'Ocean Cyan', color: 'bg-cyan-500', preview: 'Cool ocean cyan layout' },
  { id: 'forest-emerald', name: 'Forest Emerald', color: 'bg-emerald-500', preview: 'Natural emerald green' },
  { id: 'vintage-brown', name: 'Vintage Brown', color: 'bg-amber-700', preview: 'Classic vintage brown' },
  { id: 'electric-violet', name: 'Electric Violet', color: 'bg-violet-500', preview: 'Modern electric violet' },
  { id: 'steel-blue', name: 'Steel Blue', color: 'bg-blue-600', preview: 'Industrial steel blue' },
  { id: 'golden-yellow', name: 'Golden Yellow', color: 'bg-yellow-500', preview: 'Bright golden yellow' },
  { id: 'deep-rose', name: 'Deep Rose', color: 'bg-rose-600', preview: 'Elegant deep rose theme' },
  { id: 'midnight-black', name: 'Midnight Black', color: 'bg-black', preview: 'Sleek midnight black design' }
];

interface TemplatesSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

export function TemplatesSelector({ onSelectTemplate }: TemplatesSelectorProps) {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Choose Your Resume Template
        </h1>
        <p className="text-muted-foreground text-lg">
          Select from 20 professional templates to create your perfect resume
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resumeTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardContent className="p-0">
              <div className={`h-32 ${template.color} rounded-t-lg flex items-center justify-center`}>
                <div className="text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-white rounded"></div>
                  </div>
                  <div className="text-sm font-semibold">Resume Preview</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{template.preview}</p>
                <Button className="w-full">
                  Use This Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}