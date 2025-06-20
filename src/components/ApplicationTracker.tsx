
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, Phone, ExternalLink, Filter, Search } from "lucide-react";

interface Application {
  id: string;
  company: string;
  position: string;
  status: "Applied" | "Under Review" | "Interview Scheduled" | "Offer" | "Rejected";
  appliedDate: string;
  lastUpdate: string;
  source: string;
  salary: string;
  notes: string;
  nextAction?: string;
  nextActionDate?: string;
}

const ApplicationTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [applications] = useState<Application[]>([
    {
      id: "1",
      company: "TechCorp Inc",
      position: "Senior React Developer",
      status: "Interview Scheduled",
      appliedDate: "2024-01-15",
      lastUpdate: "2024-01-18",
      source: "LinkedIn",
      salary: "$120k - $150k",
      notes: "Technical interview scheduled for next week",
      nextAction: "Technical Interview",
      nextActionDate: "2024-01-22"
    },
    {
      id: "2",
      company: "StartupXYZ",
      position: "Full Stack Engineer",
      status: "Under Review",
      appliedDate: "2024-01-14",
      lastUpdate: "2024-01-16",
      source: "AngelList",
      salary: "$90k - $130k",
      notes: "HR contacted for initial screening",
      nextAction: "Follow up email",
      nextActionDate: "2024-01-20"
    },
    {
      id: "3",
      company: "DesignStudio",
      position: "Frontend Developer",
      status: "Applied",
      appliedDate: "2024-01-13",
      lastUpdate: "2024-01-13",
      source: "Indeed",
      salary: "$80k - $110k",
      notes: "Application submitted via company website"
    },
    {
      id: "4",
      company: "BigTech Corp",
      position: "Software Engineer",
      status: "Rejected",
      appliedDate: "2024-01-10",
      lastUpdate: "2024-01-17",
      source: "Company Website",
      salary: "$150k+",
      notes: "Position filled internally"
    },
    {
      id: "5",
      company: "GrowthCo",
      position: "React Developer",
      status: "Offer",
      appliedDate: "2024-01-08",
      lastUpdate: "2024-01-19",
      source: "Referral",
      salary: "$110k - $140k",
      notes: "Offer received! Deadline: Jan 25th",
      nextAction: "Respond to offer",
      nextActionDate: "2024-01-25"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Interview Scheduled":
        return "bg-purple-100 text-purple-800";
      case "Offer":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Application Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by company or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-gray-600">{status}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Applications ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              {filteredApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{app.position}</h3>
                      <p className="text-gray-600 mb-2">{app.company}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied: {app.appliedDate}
                        </span>
                        <span>Source: {app.source}</span>
                        <span>Salary: {app.salary}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                  </div>
                  
                  {app.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm">{app.notes}</p>
                    </div>
                  )}
                  
                  {app.nextAction && (
                    <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                      <p className="text-sm font-medium text-blue-800">
                        Next Action: {app.nextAction}
                      </p>
                      {app.nextActionDate && (
                        <p className="text-xs text-blue-600">
                          Due: {app.nextActionDate}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Send Follow-up
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Schedule Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Job
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="kanban">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {["Applied", "Under Review", "Interview Scheduled", "Offer", "Rejected"].map((status) => (
                  <div key={status} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-4 text-center">
                      {status} ({applications.filter(app => app.status === status).length})
                    </h4>
                    <div className="space-y-3">
                      {applications
                        .filter(app => app.status === status)
                        .map((app) => (
                          <div key={app.id} className="bg-white p-3 rounded shadow-sm">
                            <h5 className="font-medium text-sm">{app.position}</h5>
                            <p className="text-xs text-gray-600">{app.company}</p>
                            <p className="text-xs text-gray-500 mt-1">{app.appliedDate}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationTracker;
