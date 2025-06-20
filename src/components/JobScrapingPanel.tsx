
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useJobScraping } from '@/hooks/useJobScraping';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const JobScrapingPanel = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  
  const { loading, scrapingJobs, startScraping, getScrapingJobs } = useJobScraping();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    getScrapingJobs();
  }, []);

  const handleStartScraping = async () => {
    if (!query.trim()) return;

    const searchQuery = {
      query,
      location: location || undefined,
      jobType: jobType || undefined,
      salaryRange: salaryRange || undefined
    };

    const result = await startScraping(searchQuery);
    
    if (result.error) {
      console.error('Scraping error:', result.error);
    } else {
      trackEvent('job_scraping_started', searchQuery);
      setQuery('');
      setLocation('');
      setJobType('');
      setSalaryRange('');
      getScrapingJobs();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Job Scraping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Job title or keywords"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Job type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={salaryRange} onValueChange={setSalaryRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Salary range (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-50k">$0 - $50k</SelectItem>
                  <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                  <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                  <SelectItem value="150k+">$150k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleStartScraping} disabled={loading || !query.trim()}>
            {loading ? 'Starting Scraping...' : 'Start Job Scraping'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scraping Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scrapingJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No scraping jobs yet</p>
            ) : (
              scrapingJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="font-medium">Job Scraping</p>
                      <p className="text-sm text-gray-500">
                        Started: {new Date(job.started_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{job.jobs_found} jobs found</span>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobScrapingPanel;
