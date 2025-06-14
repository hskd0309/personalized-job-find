import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ApplicationModalProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationModal({ job, isOpen, onClose }: ApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    notes: '',
  });
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume to apply",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload resume to storage
      const fileName = `${user.id}/${Date.now()}-${resumeFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Create application record
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          job_id: job.id,
          job_title: job.title,
          company_name: job.company,
          location: job.location,
          notes: formData.notes,
          resume_url: publicUrl,
          status: 'Applied'
        });

      if (applicationError) throw applicationError;

      // Update application count for the job
      const { error: updateError } = await supabase
        .from('job_postings')
        .update({ 
          applications_count: (job.applications_count || 0) + 1 
        })
        .eq('id', job.id);

      if (updateError) console.error('Failed to update application count:', updateError);

      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the employer",
      });

      onClose();
      setResumeFile(null);
      setFormData({ notes: '' });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Application failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Apply for {job.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume" className="text-sm font-medium">Resume (PDF)*</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label 
                htmlFor="resume" 
                className="flex-1 flex items-center justify-center gap-2 h-10 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                {resumeFile ? resumeFile.name : 'Choose PDF file'}
              </Label>
            </div>
            {resumeFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Cover Letter / Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Tell the employer why you're interested in this position..."
              value={formData.notes}
              onChange={(e) => setFormData({ notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !resumeFile} className="flex-1">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Apply Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}