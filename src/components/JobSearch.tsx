
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalytics } from "@/hooks/useAnalytics";
import JobScrapingPanel from "./JobScrapingPanel";
import { Search, MapPin, DollarSign, Clock, Building, ExternalLink, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const { trackEvent } = useAnalytics();

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ['jobSearch', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      trackEvent('job_search_performed', { query: searchTerm });
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .textSearch('title_description', searchTerm, { type: 'websearch' });
      
      if (error) {
        console.error("Error searching for jobs:", error);
        return [];
      }
      return data;
    },
    enabled: !!searchTerm,
  });

  const handleSearch = (query: string) => {
    setSearchTerm(query);
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
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>
            <Button 
              onClick={() => handleSearch(searchTerm)}
              disabled={isSearching}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-2">
            {["DevOps", "Data Science", "React Developer", "Frontend Engineer", "Full Stack", "Remote Jobs"].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => handleSearch(term)}
                className="text-indigo-700 border-indigo-200 hover:bg-indigo-50"
              >
                {term}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {(searchResults || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results ({(searchResults || []).length})</span>
              <Badge variant="secondary">{(searchResults || []).length} jobs found</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(searchResults || []).map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        {job.match_score && (
                          <Badge className={getMatchScoreColor(job.match_score)}>
                            {job.match_score}% match
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 mb-2 flex-wrap">
                        {job.company && <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>}
                        {job.location && <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>}
                        {job.salary_range && <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary_range}</span>
                        </div>}
                        {job.posted_date && <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.posted_date}</span>
                        </div>}
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                      {job.skills_required && job.skills_required.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills_required.map((skill: string) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      <a href={job.external_url} target="_blank" rel="noopener noreferrer">Apply Now</a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
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

      {/* Job Details Drawer */}
      <Drawer open={!!selectedJob} onOpenChange={(isOpen) => !isOpen && setSelectedJob(null)}>
        <DrawerContent className="max-h-[90vh]">
          {selectedJob && (
            <>
              <DrawerHeader className="flex justify-between items-start">
                <div>
                  <DrawerTitle className="text-2xl font-bold text-gray-900">{selectedJob.title}</DrawerTitle>
                  <DrawerDescription>
                    <div className="flex items-center gap-4 text-gray-600 mt-2 flex-wrap">
                      {selectedJob.company && <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{selectedJob.company}</span>
                      </div>}
                      {selectedJob.location && <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedJob.location}</span>
                      </div>}
                      {selectedJob.salary_range && <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{selectedJob.salary_range}</span>
                      </div>}
                      {selectedJob.posted_date && <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{selectedJob.posted_date}</span>
                      </div>}
                    </div>
                  </DrawerDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}>
                  <X className="h-6 w-6" />
                </Button>
              </DrawerHeader>
              <div className="px-4 pb-4 overflow-y-auto">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                
                {selectedJob.skills_required && selectedJob.skills_required.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Skills Required</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills_required.map((skill: string) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button asChild size="lg" className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700">
                  <a href={selectedJob.external_url} target="_blank" rel="noopener noreferrer">
                    Apply on Company Site <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Tabbed Interface */}
      <Tabs defaultValue="automated" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="automated">Automated Scraping</TabsTrigger>
          <TabsTrigger value="manual">Manual Search</TabsTrigger>
        </TabsList>
        
        <TabsContent value="automated">
          <JobScrapingPanel />
        </TabsContent>
        
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Job Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manually add job applications you've submitted.</p>
              {/* Form for manual entry can go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobSearch;
