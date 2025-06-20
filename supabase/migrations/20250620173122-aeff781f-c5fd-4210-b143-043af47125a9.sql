
-- Create job_sources table for tracking different job platforms
CREATE TABLE public.job_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  rate_limit_per_hour INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial job sources
INSERT INTO public.job_sources (name, base_url, rate_limit_per_hour) VALUES
('LinkedIn', 'https://www.linkedin.com', 50),
('Indeed', 'https://www.indeed.com', 100),
('Glassdoor', 'https://www.glassdoor.com', 75);

-- Create search_queries table for tracking user searches
CREATE TABLE public.search_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  query TEXT NOT NULL,
  location TEXT,
  job_type TEXT,
  salary_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_run_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create scraping_jobs table for tracking scraping operations
CREATE TABLE public.scraping_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  search_query_id UUID REFERENCES public.search_queries(id),
  source_id UUID REFERENCES public.job_sources(id),
  status TEXT DEFAULT 'pending',
  jobs_found INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB
);

-- Update jobs table with additional fields
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES public.job_sources(id);
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS match_score INTEGER DEFAULT 0;

-- Create resume_profiles table for AI optimization
CREATE TABLE public.resume_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  skills TEXT[],
  experience_years INTEGER,
  education TEXT,
  certifications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_primary BOOLEAN DEFAULT false
);

-- Create application_emails table for email tracking
CREATE TABLE public.application_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.job_applications(id) NOT NULL,
  email_type TEXT NOT NULL, -- 'application', 'follow_up', 'thank_you'
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rate_limits table for API rate limiting
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  source_id UUID REFERENCES public.job_sources(id) NOT NULL,
  requests_count INTEGER DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics_events table for tracking user actions
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.job_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for job_sources (public read access)
CREATE POLICY "Anyone can view job sources" ON public.job_sources FOR SELECT USING (true);

-- Create RLS policies for search_queries
CREATE POLICY "Users can view their own search queries" ON public.search_queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own search queries" ON public.search_queries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own search queries" ON public.search_queries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own search queries" ON public.search_queries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for scraping_jobs
CREATE POLICY "Users can view their own scraping jobs" ON public.scraping_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own scraping jobs" ON public.scraping_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scraping jobs" ON public.scraping_jobs FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for resume_profiles
CREATE POLICY "Users can view their own resume profiles" ON public.resume_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own resume profiles" ON public.resume_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resume profiles" ON public.resume_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resume profiles" ON public.resume_profiles FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for application_emails
CREATE POLICY "Users can view their own application emails" ON public.application_emails FOR SELECT USING (
  auth.uid() IN (
    SELECT ja.applicant_id FROM public.job_applications ja WHERE ja.id = application_id
  )
);
CREATE POLICY "Users can create their own application emails" ON public.application_emails FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT ja.applicant_id FROM public.job_applications ja WHERE ja.id = application_id
  )
);
CREATE POLICY "Users can update their own application emails" ON public.application_emails FOR UPDATE USING (
  auth.uid() IN (
    SELECT ja.applicant_id FROM public.job_applications ja WHERE ja.id = application_id
  )
);

-- Create RLS policies for rate_limits
CREATE POLICY "Users can view their own rate limits" ON public.rate_limits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own rate limits" ON public.rate_limits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rate limits" ON public.rate_limits FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for analytics_events
CREATE POLICY "Users can view their own analytics events" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own analytics events" ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_jobs_source_id ON public.jobs(source_id);
CREATE INDEX idx_jobs_match_score ON public.jobs(match_score DESC);
CREATE INDEX idx_search_queries_user_id ON public.search_queries(user_id);
CREATE INDEX idx_scraping_jobs_status ON public.scraping_jobs(status);
CREATE INDEX idx_rate_limits_user_source ON public.rate_limits(user_id, source_id);
CREATE INDEX idx_analytics_events_user_type ON public.analytics_events(user_id, event_type);
