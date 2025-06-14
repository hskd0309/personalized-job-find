-- Add user_type to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_type TEXT DEFAULT 'job_seeker' CHECK (user_type IN ('job_seeker', 'recruiter'));

-- Update the handle_new_user function to include user_type from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'job_seeker')
  );
  RETURN NEW;
END;
$function$;

-- Remove the separate recruiter_profiles table since we're using user_type now
DROP TABLE IF EXISTS public.recruiter_profiles CASCADE;

-- Add organization fields to profiles for recruiters
ALTER TABLE public.profiles 
ADD COLUMN company_name TEXT,
ADD COLUMN company_description TEXT,
ADD COLUMN company_website TEXT,
ADD COLUMN company_size TEXT,
ADD COLUMN industry TEXT;

-- Update job_postings to reference user_id directly instead of recruiter_id
ALTER TABLE public.job_postings 
DROP CONSTRAINT IF EXISTS job_postings_recruiter_id_fkey;

ALTER TABLE public.job_postings 
RENAME COLUMN recruiter_id TO user_id;

-- Update RLS policies for job_postings
DROP POLICY IF EXISTS "Recruiters can manage their own job postings" ON public.job_postings;

CREATE POLICY "Recruiters can manage their own job postings" 
ON public.job_postings 
FOR ALL 
USING (
  user_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'recruiter'
  )
);

-- Create policy for job seekers to view active jobs
CREATE POLICY "Job seekers can view active jobs" 
ON public.job_postings 
FOR SELECT 
USING (
  is_active = true AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'job_seeker'
  )
);

-- Update existing users to be job_seekers by default
UPDATE public.profiles 
SET user_type = 'job_seeker' 
WHERE user_type IS NULL;