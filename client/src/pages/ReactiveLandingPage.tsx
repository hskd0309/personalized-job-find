import React from 'react';
import { ArrowRight, FileText, Briefcase, TrendingUp, Zap, Shield, Globe } from 'lucide-react';
import { ReactiveButton } from '@/components/ui/reactive-button';
import { ReactiveCard } from '@/components/ui/reactive-card';

export function ReactiveLandingPage() {
  const features = [
    {
      icon: FileText,
      title: 'AI Resume Analysis',
      description: 'Get instant feedback on your resume with our advanced AI technology that analyzes content, format, and ATS compatibility.'
    },
    {
      icon: Briefcase,
      title: 'Smart Job Matching',
      description: 'Discover personalized job recommendations based on your skills, experience, and career goals.'
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Access data-driven insights about salary trends, skill gaps, and growth opportunities in your field.'
    },
    {
      icon: Zap,
      title: 'Instant Application',
      description: 'Apply to multiple jobs with one click using your optimized resume and cover letter templates.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. We never share your personal information with third parties.'
    },
    {
      icon: Globe,
      title: 'Global Opportunities',
      description: 'Access job opportunities from companies worldwide, with support for multiple languages and regions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-zinc-100 mb-8 leading-tight">
              Land Your Dream Job with
              <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                AI-Powered Insights
              </span>
            </h1>
            <p className="text-xl text-zinc-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your job search with our intelligent resume analyzer and personalized job recommendations. 
              Get matched with opportunities that align with your skills and aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ReactiveButton size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </ReactiveButton>
              <ReactiveButton variant="outline" size="lg">
                Watch Demo
              </ReactiveButton>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              Our comprehensive platform combines AI technology with human insights 
              to accelerate your career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ReactiveCard key={index} className="group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-100">{feature.title}</h3>
                </div>
                <p className="text-zinc-300 leading-relaxed">{feature.description}</p>
              </ReactiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <ReactiveCard className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already accelerated their career 
              growth with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ReactiveButton size="lg">
                Start Your Journey
              </ReactiveButton>
              <ReactiveButton variant="outline" size="lg">
                Learn More
              </ReactiveButton>
            </div>
          </ReactiveCard>
        </div>
      </section>
    </div>
  );
}