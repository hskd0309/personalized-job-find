import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Edit } from 'lucide-react';

export function ResumeBuilderPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Resume Builder</h1>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create New Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resume Templates */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Professional', 'Modern', 'Creative', 'Minimal'].map((template) => (
                  <div key={template} className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="h-48 bg-muted rounded mb-3 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-center">{template}</h3>
                    <Button variant="outline" className="w-full mt-2" size="sm">
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Resumes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>My Resumes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border rounded-lg p-3">
                <h4 className="font-medium">Software Engineer Resume</h4>
                <p className="text-xs text-muted-foreground mb-2">Last updated: June 8, 2024</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="font-medium">Frontend Developer Resume</h4>
                <p className="text-xs text-muted-foreground mb-2">Last updated: June 5, 2024</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Resume Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Keep it to 1-2 pages maximum</p>
              <p>• Use action verbs to describe accomplishments</p>
              <p>• Quantify your achievements with numbers</p>
              <p>• Tailor your resume for each job application</p>
              <p>• Include relevant keywords from job descriptions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}