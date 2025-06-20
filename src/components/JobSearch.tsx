
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobScraping } from "@/hooks/useJobScraping";
import { useAnalytics } from "@/hooks/useAnalytics";
import JobScrapingPanel from "./JobScrapingPanel";
import { Search, MapPin, DollarSign, Clock, Building, ExternalLink } from "lucide-react";

const JobSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { trackEvent } = useAnalytics();

  // Mock job data for demonstration
  const mockJobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      salary_range: "$120k - $160k",
      description: "We're looking for an experienced frontend developer...",
      skills_required: ["React", "TypeScript", "Node.js"],
      posted_date: "2 days ago",
      match_score: 95,
      external_url: "https://example.com/job1"
    },
    {
      id: "2",
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      salary_range: "$100k - $140k",
      description: "Join our growing team of engineers...",
      skills_required: ["JavaScript", "Python", "AWS"],
      posted_date: "1 week ago",
      match_score: 87,
      external_url: "https://example.com/job2"
    },
    {
      id: "3",
      title: "React Developer",
      company: "WebAgency",
      location: "New York, NY",
      type: "Contract",
      salary_range: "$80k - $110k",
      description: "Looking for a React specialist...",
      skills_required: ["React", "JavaScript", "CSS"],
      posted_date: "3 days ago",
      match_score: 92,
      external_url: "https://example.com/job3"
    }
  ];

  const handleQuickSearch = (query: string) => {
    setIsSearching(true);
    trackEvent('quick_search_performed', { query });
    
    // Simulate search delay
    setTimeout(() => {
      const filteredJobs = mockJobs.filter(job => 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.skills_required.some(skill => 
          skill.toLowerCase().includes(query.toLowerCase())
        )
      );
      setSearchResults(filteredJobs);
      setIsSearching(false);
    }, 1500);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Quick Search Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Search className="h-6 w-6" />
            Job Search & Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for jobs, companies, or skills..."
                className="pl-10"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleQuickSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>
            <Button 
              onClick={() => {
                const input = document.querySelector('input[placeholder*="Search for jobs"]') as HTMLInputElement;
                handleQuickSearch(input?.value || '');
              }}
              disabled={isSearching}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-2">
            {["React Developer", "Frontend Engineer", "Full Stack", "Remote Jobs"].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSearch(term)}
                className="text-indigo-700 border-indigo-200 hover:bg-indigo-50"
              >
                {term}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results ({searchResults.length})</span>
              <Badge variant="secondary">{searchResults.length} jobs found</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <Badge className={getMatchScoreColor(job.match_score)}>
                          {job.match_score}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary_range}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.posted_date}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills_required.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      Save Job
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabbed Interface */}
      <Tabs defaultValue="scraping" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scraping">Automated Scraping</TabsTrigger>
          <TabsTrigger value="manual">Manual Search</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scraping" className="space-y-4">
          <JobScrapingPanel />
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Job Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Job title or keywords" />
                <Input placeholder="Location" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Search className="h-4 w-4 mr-2" />
                Search Jobs Manually
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobSearch;
