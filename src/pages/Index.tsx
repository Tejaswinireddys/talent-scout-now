import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import JobSearch from "@/components/JobSearch";
import Dashboard from "@/components/Dashboard";
import ResumeOptimizer from "@/components/ResumeOptimizer";
import ApplicationTracker from "@/components/ApplicationTracker";
import { Search, BarChart3, FileText, Briefcase, User, Settings, LogOut, Sparkles, TrendingUp } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 animate-gradient"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Mesh pattern overlay */}
        <div className="absolute inset-0 bg-mesh-pattern opacity-50"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative backdrop-blur-md bg-white/80 shadow-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex items-center group">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl mr-4 shadow-lg animate-pulse-glow group-hover:scale-105 transition-transform">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gradient-enhanced">
                    TalentScout Pro
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">AI-Powered Career Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold">{user?.email?.split('@')[0]}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="btn-enhanced glass-effect hover:bg-white/50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="btn-enhanced glass-effect hover:bg-red-50/50">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Welcome Section */}
        <div className="mb-12 text-center relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 rounded-full px-6 py-2 mb-6 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
            <span className="text-sm font-semibold text-indigo-700">Welcome back to your success journey</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Accelerate Your</span>
            <br />
            <span className="text-gradient-enhanced">Dream Career</span> �
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Harness the power of AI to discover opportunities, optimize your resume, 
            and track applications with intelligent insights that put you ahead of the competition.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">85% Success Rate</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">50K+ Jobs Tracked</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">AI-Powered Matching</span>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="card-enhanced rounded-2xl p-3 mb-8 relative overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
            
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-xl p-2 border-0 shadow-inner">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 transition-all duration-300 rounded-lg font-semibold"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="search" 
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-green-600 transition-all duration-300 rounded-lg font-semibold"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Job Search</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resume" 
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-purple-600 transition-all duration-300 rounded-lg font-semibold"
              >
                <FileText className="h-5 w-5" />
                <span className="hidden sm:inline">Resume AI</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tracker" 
                className="flex items-center gap-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-orange-600 transition-all duration-300 rounded-lg font-semibold"
              >
                <Briefcase className="h-5 w-5" />
                <span className="hidden sm:inline">Applications</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Enhanced Tab Content */}
          <div className="card-enhanced rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            
            <TabsContent value="dashboard" className="p-8 m-0 relative z-10">
              <Dashboard />
            </TabsContent>

            <TabsContent value="search" className="p-8 m-0 relative z-10">
              <JobSearch />
            </TabsContent>

            <TabsContent value="resume" className="p-8 m-0 relative z-10">
              <ResumeOptimizer />
            </TabsContent>

            <TabsContent value="tracker" className="p-8 m-0 relative z-10">
              <ApplicationTracker />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative mt-20 backdrop-blur-md bg-white/60 border-t border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-700">TalentScout Pro</span>
            </div>
            <p className="text-gray-500 font-medium">
              © 2024 TalentScout Pro. Empowering careers through intelligent automation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
