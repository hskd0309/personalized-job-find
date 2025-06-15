import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Layout, Zap } from 'lucide-react';

export function ResumeBuilderPage() {
  const handleOpenResumeBuilder = () => {
    // Navigate to the resume builder within the app
    window.location.href = '/app/resume-builder';
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
            <CardTitle className="flex items-center gap-2 text-secondary">
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
            <CardTitle className="flex items-center gap-2 text-accent">
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
            <Button 
              onClick={handleOpenResumeBuilder}
              size="lg"
              className="bg-foreground text-background hover:bg-muted-foreground"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Open Resume Builder
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Navigate to the resume builder
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}