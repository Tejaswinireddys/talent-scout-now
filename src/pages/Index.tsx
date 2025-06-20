
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobSearch from "@/components/JobSearch";
import Dashboard from "@/components/Dashboard";
import ResumeOptimizer from "@/components/ResumeOptimizer";
import ApplicationTracker from "@/components/ApplicationTracker";
import { Search, BarChart3, FileText, Briefcase } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">JobSeeker Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Settings</Button>
              <Button>Profile</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Automate Your Job Search
          </h2>
          <p className="text-gray-600 text-lg">
            Find, apply, and track job applications across multiple platforms with AI-powered optimization.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Job Search
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resume Optimizer
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <JobSearch />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="resume">
            <ResumeOptimizer />
          </TabsContent>

          <TabsContent value="tracker">
            <ApplicationTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
