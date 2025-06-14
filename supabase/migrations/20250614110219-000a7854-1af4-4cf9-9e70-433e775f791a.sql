-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for resumes
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
CREATE POLICY "Users can upload their own resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
CREATE POLICY "Users can view their own resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Recruiters can view resumes from applications" ON storage.objects;
CREATE POLICY "Recruiters can view resumes from applications" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'resumes' AND 
  EXISTS (
    SELECT 1 FROM applications a
    JOIN job_postings jp ON a.job_id = jp.id::text
    WHERE jp.user_id = auth.uid()
    AND a.user_id::text = (storage.foldername(name))[1]
  )
);

-- Update applications table to include resume_url
ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_url TEXT;