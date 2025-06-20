
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Mail, Clock, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const stats = {
    totalApplications: 247,
    pending: 89,
    interviews: 12,
    offers: 3,
    successRate: 18.2,
    weeklyApplications: 45,
    responseRate: 24.5,
    avgResponseTime: "5.2 days"
  };

  const recentApplications = [
    {
      id: 1,
      company: "TechCorp",
      position: "Senior React Developer",
      status: "Interview Scheduled",
      appliedDate: "2024-01-15",
      source: "LinkedIn"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "Full Stack Engineer",
      status: "Under Review",
      appliedDate: "2024-01-14",
      source: "AngelList"
    },
    {
      id: 3,
      company: "DesignStudio",
      position: "Frontend Developer",
      status: "Applied",
      appliedDate: "2024-01-13",
      source: "Indeed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interview Scheduled":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Applied":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.weeklyApplications} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Avg response: {stats.avgResponseTime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.responseRate}% response rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Offers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.successRate}% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Application Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Applied ({stats.totalApplications})</span>
              <span>100%</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Under Review ({stats.pending})</span>
              <span>{Math.round((stats.pending / stats.totalApplications) * 100)}%</span>
            </div>
            <Progress value={(stats.pending / stats.totalApplications) * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Interviews ({stats.interviews})</span>
              <span>{Math.round((stats.interviews / stats.totalApplications) * 100)}%</span>
            </div>
            <Progress value={(stats.interviews / stats.totalApplications) * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Offers ({stats.offers})</span>
              <span>{Math.round((stats.offers / stats.totalApplications) * 100)}%</span>
            </div>
            <Progress value={(stats.offers / stats.totalApplications) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{app.position}</h4>
                  <p className="text-sm text-gray-600">{app.company}</p>
                  <p className="text-xs text-gray-500">Applied on {app.appliedDate} via {app.source}</p>
                </div>
                <Badge className={getStatusColor(app.status)}>
                  {app.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
