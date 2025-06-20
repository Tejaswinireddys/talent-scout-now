
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import JobSearch from "@/components/JobSearch";
import Dashboard from "@/components/Dashboard";
import ResumeOptimizer from "@/components/ResumeOptimizer";
import ApplicationTracker from "@/components/ApplicationTracker";
import { Search, BarChart3, FileText, Briefcase, User, Settings, LogOut } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg mr-3">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  JobSeeker Pro
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back! 👋
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automate your job search, optimize your resume, and track applications with AI-powered insights.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-gray-50 rounded-lg p-1">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="search" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Job Search</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resume" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Resume AI</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tracker" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Applications</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-lg">
            <TabsContent value="dashboard" className="p-6 m-0">
              <Dashboard />
            </TabsContent>

            <TabsContent value="search" className="p-6 m-0">
              <JobSearch />
            </TabsContent>

            <TabsContent value="resume" className="p-6 m-0">
              <ResumeOptimizer />
            </TabsContent>

            <TabsContent value="tracker" className="p-6 m-0">
              <ApplicationTracker />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 JobSeeker Pro. Powered by AI for smarter job searching.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
