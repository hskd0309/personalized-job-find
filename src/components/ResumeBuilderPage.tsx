import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Layout, Zap, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ResumeBuilderPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeSlug, setResumeSlug] = useState('');

  const handleCreateResume = () => {
    if (!resumeTitle.trim()) return;
    
    // For now, just show an alert with the resume details
    alert(`Creating resume: "${resumeTitle}" with slug: "${resumeSlug || resumeTitle.toLowerCase().replace(/\s+/g, '-')}"`);
    setShowCreateDialog(false);
    setResumeTitle('');
    setResumeSlug('');
  };

  const handleTitleChange = (value: string) => {
    setResumeTitle(value);
    // Auto-generate slug from title
    setResumeSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground hover:text-muted-foreground transition-colors">
          Professional Resume Builder
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create stunning, professional resumes with our advanced resume builder. Choose from multiple templates and customize to your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Feature Cards */}
        <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Layout className="h-5 w-5" />
              Multiple Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Choose from 12+ professional resume templates designed for different industries and career levels.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-secondary/5 border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5" />
              Real-time Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See your changes instantly with live preview. Export to PDF when you're ready.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5" />
              ATS Optimized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All templates are optimized for Applicant Tracking Systems (ATS) to pass automated screenings.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main CTA */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-background to-primary/10 border-primary/30">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Build Your Resume?</h2>
            <p className="text-muted-foreground mb-6">
              Our advanced resume builder includes professional templates, real-time editing, and PDF export functionality.
            </p>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-foreground text-background hover:bg-muted-foreground"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Resume
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create a new resume
                  </DialogTitle>
                  <DialogDescription>
                    Start building your resume by giving it a name.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Software Engineer Resume"
                      value={resumeTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Tip: You can name the resume referring to the position you are applying for.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="software-engineer-resume"
                      value={resumeSlug}
                      onChange={(e) => setResumeSlug(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    onClick={handleCreateResume}
                    disabled={!resumeTitle.trim()}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <p className="text-xs text-muted-foreground mt-4">
              Click to start creating your professional resume
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}