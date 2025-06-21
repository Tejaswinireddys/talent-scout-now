-- Add salary_range and posted_date to jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS salary_range TEXT,
ADD COLUMN IF NOT EXISTS posted_date TEXT;

-- Also add a title_description column for full-text search
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS title_description tsvector
GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))) STORED;

-- Create an index on the new tsvector column
CREATE INDEX jobs_title_description_idx ON public.jobs USING GIN(title_description);
