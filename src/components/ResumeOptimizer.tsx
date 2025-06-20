
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Zap, Target, AlertCircle } from "lucide-react";

const ResumeOptimizer = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [matchScore, setMatchScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMatch = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100%
      setMatchScore(score);
      setSuggestions([
        "Add more specific technical skills mentioned in the job description",
        "Include quantified achievements with numbers and percentages",
        "Use action verbs like 'implemented', 'optimized', 'developed'",
        "Match the exact job title keywords in your experience section",
        "Add relevant certifications or technologies mentioned"
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* Upload Resume */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Upload & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Resume</h3>
            <p className="text-gray-600 mb-4">Drag and drop your resume file or click to browse</p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Or paste your resume text:</label>
            <Textarea
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Job Description Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Job Description Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Paste the job description you want to optimize for:</label>
            <Textarea
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
            />
          </div>
          
          <Button 
            onClick={analyzeMatch}
            disabled={!jobDescription || !resumeText || isAnalyzing}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Analyze & Optimize Resume"}
          </Button>
        </CardContent>
      </Card>

      {/* Match Score */}
      {matchScore > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resume Match Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-6 rounded-lg ${getScoreBg(matchScore)}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(matchScore)} mb-2`}>
                  {matchScore}%
                </div>
                <p className="text-gray-700">Resume Match Score</p>
              </div>
              <Progress value={matchScore} className="mt-4 h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <p className="text-sm text-gray-600">Keyword Match</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">92%</div>
                <p className="text-sm text-gray-600">Skill Match</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">78%</div>
                <p className="text-sm text-gray-600">Experience Match</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Zap className="h-4 w-4 mr-2" />
                Auto-Optimize Resume
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Optimized Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resume Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["ATS-Friendly", "Creative", "Executive"].map((template) => (
              <div key={template} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="font-medium mb-2">{template}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Optimized for {template.toLowerCase()} positions
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeOptimizer;
