import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  TrendingUp, 
  Users,
  Building,
  Clock,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function HomePage() {
  const [stats, setStats] = useState({
    applications: 0,
    resumes: 0,
    saved_jobs: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [applicationsRes, resumesRes] = await Promise.all([
        supabase.from('applications').select('id').eq('user_id', user.id),
        supabase.from('resumes').select('id').eq('user_id', user.id)
      ]);

      setStats({
        applications: applicationsRes.data?.length || 0,
        resumes: resumesRes.data?.length || 0,
        saved_jobs: 0 // You can implement saved jobs feature later
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'AI Job Match',
      description: 'Get personalized job recommendations',
      icon: TrendingUp,
      href: '/app/job-matches',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Resume Analyzer',
      description: 'AI-powered resume optimization',
      icon: Users,
      href: '/app/resume-analyzer',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Find Jobs',
      description: 'Search for opportunities worldwide',
      icon: Search,
      href: '/app/job-search',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Build Resume',
      description: 'Create professional resumes',
      icon: FileText,
      href: '/app/resume-builder',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'AI Career Chat',
      description: 'Get personalized career advice',
      icon: MessageSquare,
      href: '/app/career-chat',
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-violet-500'
    },
    {
      title: 'My Applications',
      description: 'Track your job applications',
      icon: Briefcase,
      href: '/app/applications',
      color: 'bg-teal-500',
      gradient: 'from-teal-500 to-emerald-500'
    }
  ];

  const recentActivities = [
    { text: 'Applied to Software Engineer at TCS', time: '2 hours ago', icon: Briefcase },
    { text: 'Updated resume template', time: '1 day ago', icon: FileText },
    { text: 'Searched for React Developer jobs', time: '2 days ago', icon: Search },
    { text: 'Used AI Career Assistant', time: '3 days ago', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
                Your Career,
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Transform your career journey with intelligent insights, personalized recommendations, and professional growth tools.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 text-lg shadow-xl">
                Get Started Free
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Image */}
        <div className="absolute bottom-0 right-0 w-1/3 h-64 bg-gradient-to-l from-transparent to-slate-900/50">
          <img 
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Professional working on laptop" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Briefcase, label: 'Applications', value: stats.applications, color: 'blue' },
            { icon: FileText, label: 'Resumes', value: stats.resumes, color: 'purple' },
            { icon: TrendingUp, label: 'Saved Jobs', value: stats.saved_jobs, color: 'indigo' }
          ].map((stat, index) => (
            <Card key={index} className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-soft hover:shadow-medium group">
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-${stat.color}-600/10`} />
              <CardContent className="relative p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-large`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-display font-bold text-slate-900">
              Accelerate Your Career
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Access powerful AI tools designed to enhance every aspect of your professional journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <Link to={action.href} key={action.title}>
                <Card className="relative overflow-hidden bg-white border-0 shadow-soft hover:shadow-large group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
                  <CardContent className="relative p-8 space-y-6 h-full flex flex-col">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-medium`}>
                        <action.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{action.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-end">
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-slate-900 group-hover:text-white border-slate-200 text-slate-700"
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Recent Activity */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-display font-bold text-slate-900">
                Track Your Progress
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Monitor your career journey with detailed analytics and insights into your applications, skill development, and market positioning.
              </p>
            </div>
            
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-soft">
              <CardContent className="p-8 space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/50">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-medium">
                      <activity.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{activity.text}</p>
                      <p className="text-sm text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Career Tips */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-display font-bold text-slate-900">
                Expert Career Guidance
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Get personalized advice from industry experts and AI-powered insights to accelerate your career growth.
              </p>
            </div>
            
            <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-soft">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  {[
                    { title: "Strategic Networking", desc: "Build meaningful professional relationships that advance your career.", icon: "🤝" },
                    { title: "Skill Development", desc: "Focus on high-demand skills that employers are actively seeking.", icon: "🚀" },
                    { title: "Resume Excellence", desc: "Craft compelling resumes that pass ATS systems and impress recruiters.", icon: "📄" }
                  ].map((tip, index) => (
                    <div key={index} className="p-6 rounded-xl bg-white/80 shadow-soft border border-slate-100">
                      <div className="flex items-start space-x-4">
                        <span className="text-2xl">{tip.icon}</span>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">{tip.title}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{tip.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link to="/app/career-chat">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-large">
                    Get Personalized Advice
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trending Jobs */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-display font-bold text-slate-900">
              Trending Opportunities
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover the most in-demand job categories and emerging career paths in today's market
            </p>
          </div>
          
          <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-soft overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
            <CardContent className="relative p-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  'Software Development', 'Data Science', 'Digital Marketing', 'Cloud Computing',
                  'AI/ML Engineer', 'Product Management', 'UI/UX Design', 'DevOps',
                  'Business Analyst', 'Full Stack Developer'
                ].map((category, index) => (
                  <Badge 
                    key={category} 
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-soft cursor-pointer text-sm font-medium"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}