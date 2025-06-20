
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, DollarSign, Calendar, ExternalLink } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  source: string;
  type: string;
  description: string;
}

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [workType, setWorkType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobSources, setJobSources] = useState({
    linkedin: true,
    indeed: true,
    glassdoor: true,
    angellist: true,
    stackoverflow: false,
    weworkremotely: false,
  });

  // Mock job data
  const [jobs] = useState<Job[]>([
    {
      id: "1",
      title: "Senior React Developer",
      company: "TechCorp Inc",
      location: "Remote (US)",
      salary: "$120k - $150k",
      posted: "2 days ago",
      source: "LinkedIn",
      type: "Remote",
      description: "We are looking for a Senior React Developer to join our team..."
    },
    {
      id: "2",
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      salary: "$90k - $130k",
      posted: "1 day ago",
      source: "AngelList",
      type: "Hybrid",
      description: "Join our growing startup as a Full Stack Engineer..."
    },
    {
      id: "3",
      title: "Frontend Developer",
      company: "DesignStudio",
      location: "New York, NY",
      salary: "$80k - $110k",
      posted: "3 days ago",
      source: "Indeed",
      type: "On-site",
      description: "We need a creative Frontend Developer to build amazing UIs..."
    }
  ]);

  const countries = [
    "United States", "Canada", "United Kingdom", "Germany", "France", 
    "Australia", "India", "Singapore", "Netherlands", "Sweden"
  ];

  const handleSourceChange = (source: string, checked: boolean) => {
    setJobSources(prev => ({ ...prev, [source]: checked }));
  };

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Job Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Job Title / Keywords</Label>
              <Input
                id="search"
                placeholder="e.g., React Developer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="worktype">Work Type</Label>
              <Select value={workType} onValueChange={setWorkType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Select value={salaryRange} onValueChange={setSalaryRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50-80k">$50k - $80k</SelectItem>
                  <SelectItem value="80-120k">$80k - $120k</SelectItem>
                  <SelectItem value="120k+">$120k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Sources */}
          <div className="space-y-3">
            <Label>Job Sources</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(jobSources).map(([source, checked]) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={source}
                    checked={checked}
                    onCheckedChange={(checked) => handleSourceChange(source, checked as boolean)}
                  />
                  <Label htmlFor={source} className="capitalize text-sm">
                    {source === 'weworkremotely' ? 'WeWorkRemotely' : 
                     source === 'stackoverflow' ? 'Stack Overflow' : 
                     source === 'angellist' ? 'AngelList' : source}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Search className="h-4 w-4 mr-2" />
              Search Jobs
            </Button>
            <Button variant="outline">
              Save Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Found {jobs.length} Jobs</h3>
          <Button variant="outline" size="sm">
            Apply to All Matching
          </Button>
        </div>

        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {job.title}
                  </h4>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {job.posted}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="secondary">{job.source}</Badge>
                  <Badge variant={job.type === 'Remote' ? 'default' : 'outline'}>
                    {job.type}
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {job.description}
              </p>
              
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Quick Apply
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Optimize Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
