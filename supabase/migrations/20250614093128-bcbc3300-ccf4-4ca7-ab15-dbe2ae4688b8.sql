-- Create recruiter profiles table
CREATE TABLE public.recruiter_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_description TEXT,
  company_website TEXT,
  company_size TEXT,
  industry TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job postings table
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  location TEXT,
  job_type TEXT DEFAULT 'full-time',
  experience_level TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  skills_required TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resume uploads table
CREATE TABLE public.resume_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  parsed_data JSONB,
  ai_score INTEGER,
  ai_feedback TEXT,
  skills_extracted TEXT[],
  experience_years INTEGER,
  education_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job matches table
CREATE TABLE public.job_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL,
  match_score DECIMAL(5,2),
  match_reasons TEXT[],
  viewed BOOLEAN DEFAULT FALSE,
  applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create skill gap analysis table
CREATE TABLE public.skill_gap_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_job_title TEXT NOT NULL,
  current_skills TEXT[],
  required_skills TEXT[],
  missing_skills TEXT[],
  skill_gap_score DECIMAL(5,2),
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recruiter_profiles
CREATE POLICY "Users can view their own recruiter profile" 
ON public.recruiter_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recruiter profile" 
ON public.recruiter_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recruiter profile" 
ON public.recruiter_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for job_postings
CREATE POLICY "Everyone can view active job postings" 
ON public.job_postings 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Recruiters can manage their own job postings" 
ON public.job_postings 
FOR ALL 
USING (
  recruiter_id IN (
    SELECT user_id FROM public.recruiter_profiles WHERE user_id = auth.uid()
  )
);

-- RLS Policies for resume_uploads
CREATE POLICY "Users can view their own resume uploads" 
ON public.resume_uploads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resume uploads" 
ON public.resume_uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume uploads" 
ON public.resume_uploads 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for job_matches
CREATE POLICY "Users can view their own job matches" 
ON public.job_matches 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create job matches" 
ON public.job_matches 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job matches" 
ON public.job_matches 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for skill_gap_analysis
CREATE POLICY "Users can view their own skill gap analysis" 
ON public.skill_gap_analysis 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own skill gap analysis" 
ON public.skill_gap_analysis 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skill gap analysis" 
ON public.skill_gap_analysis 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_recruiter_profiles_updated_at
BEFORE UPDATE ON public.recruiter_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at
BEFORE UPDATE ON public.job_postings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resume_uploads_updated_at
BEFORE UPDATE ON public.resume_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skill_gap_analysis_updated_at
BEFORE UPDATE ON public.skill_gap_analysis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints where appropriate
ALTER TABLE public.job_matches 
ADD CONSTRAINT fk_job_matches_job_id 
FOREIGN KEY (job_id) REFERENCES public.job_postings(id) ON DELETE CASCADE;