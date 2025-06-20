import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useJobScraping } from "@/hooks/useJobScraping";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  Star,
  Award,
  Eye
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
  const [isLoading, setIsLoading] = useState(true);
  
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
      setIsLoading(true);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobStats();
    getScrapingJobs();
  }, [user]);

  const eventCounts = getEventCounts();

  const statsCards = [
    {
      title: "Jobs Discovered",
      value: jobStats.total_jobs,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      accentColor: "from-blue-500 to-blue-600",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Active Pipeline",
      value: jobStats.active_applications,
      icon: Zap,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      accentColor: "from-emerald-500 to-emerald-600",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Success Rate",
      value: `${jobStats.success_rate}%`,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      accentColor: "from-purple-500 to-purple-600",
      change: "+15%",
      trend: "up"
    },
    {
      title: "AI Insights",
      value: events.length,
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      accentColor: "from-orange-500 to-orange-600",
      change: "+23%",
      trend: "up"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getMatchScoreBadgeClass = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0';
    if (score >= 75) return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0';
    if (score >= 60) return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0';
    return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0';
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-24 -translate-x-24 animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">Dashboard Overview</h2>
              <p className="text-white/80 text-lg">Your AI-powered career analytics center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white/90">
            <Eye className="h-5 w-5" />
            <span className="font-medium">Real-time insights • Live data synchronization</span>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              {/* Gradient overlay */}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500", stat.accentColor)}></div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg", stat.bgColor)}>
                    <Icon className={cn("h-7 w-7", stat.color)} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      {stat.change}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 animate-count-up">{isLoading ? '...' : stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs with enhanced styling */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b border-blue-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span>Latest Opportunities</span>
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {realtimeJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-gray-500 font-medium">No opportunities discovered yet</p>
                  <p className="text-sm text-gray-400 mt-1">AI is actively searching for perfect matches</p>
                </div>
              ) : (
                realtimeJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="group relative p-4 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-blue-200 bg-gradient-to-r from-white to-blue-50/30">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {job.title}
                      </h4>
                      <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700 border border-gray-200">
                        {job.type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <p className="text-sm font-medium text-gray-700">{job.company}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <span>📍</span> {job.location}
                      </p>
                    </div>
                    
                    {job.match_score > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge className={getMatchScoreBadgeClass(job.match_score)}>
                          {job.match_score}% AI Match
                        </Badge>
                        {job.match_score >= 85 && (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-xs font-semibold">High Match</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Scraping Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-xl border-b border-emerald-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span>AI Search Activity</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-600 font-semibold">Active</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {scrapingJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-emerald-500" />
                  </div>
                  <p className="text-gray-500 font-medium">No AI searches yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start your first automated job search</p>
                </div>
              ) : (
                scrapingJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-emerald-200 bg-gradient-to-r from-white to-emerald-50/30">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(job.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">AI Job Discovery</p>
                        <p className="text-sm text-gray-500">
                          {new Date(job.started_at).toLocaleDateString()} • {new Date(job.started_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{job.jobs_found}</div>
                        <div className="text-xs text-gray-500">opportunities</div>
                      </div>
                      <Badge className={getStatusBadgeClass(job.status)}>
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

      {/* Enhanced Analytics Section */}
      {Object.keys(eventCounts).length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl border-b border-purple-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span>AI Analytics Dashboard</span>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                Insights
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(eventCounts).map(([eventType, count]) => (
                <div key={eventType} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 hover:border-purple-200 group">
                  <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors animate-count-up">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600 capitalize font-medium">
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
