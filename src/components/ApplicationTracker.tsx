
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Building, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search
} from "lucide-react";

interface JobApplication {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
  cover_letter?: string;
  jobs?: {
    title: string;
    company: string;
    location: string;
    type: string;
  };
}

const ApplicationTracker = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  // Mock application data for demonstration
  const mockApplications: JobApplication[] = [
    {
      id: "1",
      job_id: "job1",
      status: "pending",
      applied_at: "2024-01-15T10:00:00Z",
      cover_letter: "Dear Hiring Manager...",
      jobs: {
        title: "Senior Frontend Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        type: "Full-time"
      }
    },
    {
      id: "2",
      job_id: "job2",
      status: "interviewed",
      applied_at: "2024-01-10T14:30:00Z",
      jobs: {
        title: "Full Stack Engineer",
        company: "StartupXYZ",
        location: "Remote",
        type: "Full-time"
      }
    },
    {
      id: "3",
      job_id: "job3",
      status: "rejected",
      applied_at: "2024-01-05T09:15:00Z",
      jobs: {
        title: "React Developer",
        company: "WebAgency",
        location: "New York, NY",
        type: "Contract"
      }
    }
  ];

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // For now, use mock data since the database might not have real applications
      setApplications(mockApplications);
      trackEvent('applications_viewed');
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'interviewed':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'interviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch = !searchTerm || 
      app.jobs?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobs?.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interviewed: applications.filter(app => app.status === 'interviewed').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Application Tracker</h2>
        <p className="text-purple-100">Manage and track all your job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bol`d text-gray-900">{statusCounts.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.interviewed}</div>
            <div className="text-sm text-gray-600">Interviewed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </CardContent>
            </Card>
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-4">Start applying to jobs to track your progress here.</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.jobs?.title}
                          </h3>
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1 capitalize">{application.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{application.jobs?.company}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{application.jobs?.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {application.cover_letter && (
                          <p className="text-gray-700 text-sm">{application.cover_letter.substring(0, 100)}...</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="kanban">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Kanban Board Coming Soon</h3>
              <p className="text-gray-600">The kanban board view is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationTracker;
