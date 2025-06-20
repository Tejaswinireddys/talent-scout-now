
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useJobScraping } from "@/hooks/useJobScraping";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart3, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface JobStat {
  total_jobs: number;
  active_applications: number;
  completed_applications: number;
  success_rate: number;
}

const Dashboard = () => {
  const [jobStats, setJobStats] = useState<JobStat>({
    total_jobs: 0,
    active_applications: 0,
    completed_applications: 0,
    success_rate: 0
  });
  const [realtimeJobs, setRealtimeJobs] = useState<any[]>([]);
  
  const { events, getEventCounts } = useAnalytics();
  const { scrapingJobs, getScrapingJobs } = useJobScraping();
  const { user } = useAuth();

  // Real-time subscription for jobs
  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time job updates
    const channel = supabase
      .channel('dashboard-jobs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        (payload) => {
          console.log('Real-time job update:', payload);
          fetchJobStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchJobStats = async () => {
    if (!user) return;

    try {
      // Get job statistics
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: applications } = await supabase
        .from('job_applications')
        .select('*')
        .eq('applicant_id', user.id);

      setRealtimeJobs(jobs || []);
      
      const activeApps = applications?.filter(app => app.status === 'pending') || [];
      const completedApps = applications?.filter(app => app.status === 'completed') || [];
      
      setJobStats({
        total_jobs: jobs?.length || 0,
        active_applications: activeApps.length,
        completed_applications: completedApps.length,
        success_rate: applications?.length ? Math.round((completedApps.length / applications.length) * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching job stats:', error);
    }
  };

  useEffect(() => {
    fetchJobStats();
    getScrapingJobs();
  }, [user]);

  const eventCounts = getEventCounts();

  const statsCards = [
    {
      title: "Total Jobs Found",
      value: jobStats.total_jobs,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Applications",
      value: jobStats.active_applications,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Success Rate",
      value: `${jobStats.success_rate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Analytics Events",
      value: events.length,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

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
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-indigo-100">Track your job search progress and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Jobs & Scraping Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Recent Jobs (Real-time)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {realtimeJobs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No jobs found yet</p>
              ) : (
                realtimeJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <Badge variant="secondary" className="ml-2">
                        {job.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{job.company}</p>
                    <p className="text-sm text-gray-500">{job.location}</p>
                    {job.match_score > 0 && (
                      <div className="mt-2">
                        <Badge 
                          variant={job.match_score >= 80 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {job.match_score}% match
                        </Badge>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scraping Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Scraping Activity
            </CardTitle>
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
                          {new Date(job.started_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{job.jobs_found} jobs</span>
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

      {/* Analytics Events */}
      {Object.keys(eventCounts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(eventCounts).map(([eventType, count]) => (
                <div key={eventType} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">
                    {eventType.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
