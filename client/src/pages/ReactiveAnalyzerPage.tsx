import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { ReactiveButton } from '@/components/ui/reactive-button';
import { ReactiveCard, ReactiveCardHeader, ReactiveCardContent } from '@/components/ui/reactive-card';

export function ReactiveAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setResults({
        score: 85,
        strengths: [
          'Strong technical skills section',
          'Quantified achievements',
          'Relevant work experience',
          'Professional formatting'
        ],
        improvements: [
          'Add more industry keywords',
          'Include soft skills',
          'Expand project descriptions'
        ],
        atsCompatibility: 92
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">
            AI Resume Analyzer
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Upload your resume and get instant AI-powered feedback to improve your chances of landing interviews.
          </p>
        </div>

        {/* Upload Section */}
        <ReactiveCard className="mb-8">
          <ReactiveCardHeader>
            <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Upload Your Resume
            </h2>
          </ReactiveCardHeader>
          <ReactiveCardContent>
            <div className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <FileText className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
                <p className="text-lg text-zinc-300 mb-2">
                  {file ? file.name : 'Choose your resume file'}
                </p>
                <p className="text-sm text-zinc-500">
                  Supports PDF, DOC, and DOCX formats
                </p>
              </label>
            </div>
            
            {file && (
              <div className="mt-6 flex justify-center">
                <ReactiveButton 
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  size="lg"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Resume'}
                </ReactiveButton>
              </div>
            )}
          </ReactiveCardContent>
        </ReactiveCard>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Overall Score */}
            <ReactiveCard>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-zinc-100 mb-4">Overall Score</h3>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full bg-zinc-700 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">{results.score}</span>
                  </div>
                </div>
                <p className="text-zinc-300">Your resume scored {results.score} out of 100</p>
              </div>
            </ReactiveCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <ReactiveCard>
                <ReactiveCardHeader>
                  <h3 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Strengths
                  </h3>
                </ReactiveCardHeader>
                <ReactiveCardContent>
                  <ul className="space-y-2">
                    {results.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-zinc-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </ReactiveCardContent>
              </ReactiveCard>

              {/* Improvements */}
              <ReactiveCard>
                <ReactiveCardHeader>
                  <h3 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    Suggested Improvements
                  </h3>
                </ReactiveCardHeader>
                <ReactiveCardContent>
                  <ul className="space-y-2">
                    {results.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <span className="text-zinc-300">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </ReactiveCardContent>
              </ReactiveCard>
            </div>

            {/* ATS Compatibility */}
            <ReactiveCard>
              <ReactiveCardHeader>
                <h3 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  ATS Compatibility Score
                </h3>
              </ReactiveCardHeader>
              <ReactiveCardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-300">Applicant Tracking System Compatibility</span>
                  <span className="text-2xl font-bold text-primary">{results.atsCompatibility}%</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${results.atsCompatibility}%` }}
                  />
                </div>
                <p className="text-sm text-zinc-400 mt-2">
                  Your resume is highly compatible with most ATS systems
                </p>
              </ReactiveCardContent>
            </ReactiveCard>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ReactiveButton size="lg">
                Download Improved Resume
              </ReactiveButton>
              <ReactiveButton variant="outline" size="lg">
                Get Detailed Report
              </ReactiveButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}