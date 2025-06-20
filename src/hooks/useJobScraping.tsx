
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SearchQuery {
  query: string;
  location?: string;
  jobType?: string;
  salaryRange?: string;
}

interface ScrapingJob {
  id: string;
  status: string;
  jobs_found: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
}

export const useJobScraping = () => {
  const [loading, setLoading] = useState(false);
  const [scrapingJobs, setScrapingJobs] = useState<ScrapingJob[]>([]);
  const { user } = useAuth();

  const startScraping = async (searchQuery: SearchQuery) => {
    if (!user) return { error: 'User not authenticated' };

    setLoading(true);
    try {
      // First, create or update the search query
      const { data: queryData, error: queryError } = await supabase
        .from('search_queries')
        .insert({
          user_id: user.id,
          query: searchQuery.query,
          location: searchQuery.location,
          job_type: searchQuery.jobType,
          salary_range: searchQuery.salaryRange,
        })
        .select()
        .single();

      if (queryError) throw queryError;

      // Get available job sources
      const { data: sources, error: sourcesError } = await supabase
        .from('job_sources')
        .select('*')
        .eq('is_active', true);

      if (sourcesError) throw sourcesError;

      // Create scraping jobs for each source
      const scrapingJobsData = sources.map(source => ({
        user_id: user.id,
        search_query_id: queryData.id,
        source_id: source.id,
        status: 'pending'
      }));

      const { data: jobs, error: jobsError } = await supabase
        .from('scraping_jobs')
        .insert(scrapingJobsData)
        .select();

      if (jobsError) throw jobsError;

      // In a real implementation, you would trigger your scraping service here
      console.log('Scraping jobs created:', jobs);

      return { data: jobs, error: null };
    } catch (error: any) {
      console.error('Error starting scraping:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getScrapingJobs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select(`
          *,
          search_queries (query, location),
          job_sources (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setScrapingJobs(data || []);
    } catch (error) {
      console.error('Error fetching scraping jobs:', error);
    }
  };

  return {
    loading,
    scrapingJobs,
    startScraping,
    getScrapingJobs
  };
};
