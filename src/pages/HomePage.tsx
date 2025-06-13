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
      title: 'Find Jobs',
      description: 'Search for opportunities worldwide',
      icon: Search,
      href: '/app/job-search',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Build Resume',
      description: 'Create professional resumes',
      icon: FileText,
      href: '/app/resume-builder',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'AI Career Chat',
      description: 'Get personalized career advice',
      icon: MessageSquare,
      href: '/app/career-chat',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'My Applications',
      description: 'Track your job applications',
      icon: Briefcase,
      href: '/app/applications',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const recentActivities = [
    { text: 'Applied to Software Engineer at TCS', time: '2 hours ago', icon: Briefcase },
    { text: 'Updated resume template', time: '1 day ago', icon: FileText },
    { text: 'Searched for React Developer jobs', time: '2 days ago', icon: Search },
    { text: 'Used AI Career Assistant', time: '3 days ago', icon: MessageSquare }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-scale-in">
          Welcome to Global JobPortal
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered career companion for finding dream jobs worldwide. Build resumes, track applications, and get personalized career guidance.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-scale bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.applications}</p>
              <p className="text-sm text-muted-foreground">Applications</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.resumes}</p>
              <p className="text-sm text-muted-foreground">Resumes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.saved_jobs}</p>
              <p className="text-sm text-muted-foreground">Saved Jobs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link to={action.href} key={action.title}>
              <Card className="hover-scale cursor-pointer transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-background to-secondary/5">
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center mx-auto animate-pulse`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full group">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Career Tips */}
        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Global Career Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                <h4 className="font-medium text-blue-900">Networking is Key</h4>
                <p className="text-sm text-blue-700">Join professional groups on LinkedIn and attend virtual meetups.</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
                <h4 className="font-medium text-green-900">Skill Development</h4>
                <p className="text-sm text-green-700">Focus on in-demand skills like AI, Data Science, and Cloud Computing.</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 border-l-4 border-purple-500">
                <h4 className="font-medium text-purple-900">Resume Optimization</h4>
                <p className="text-sm text-purple-700">Tailor your resume for each application with relevant keywords.</p>
              </div>
            </div>
            <Link to="/app/career-chat">
              <Button className="w-full">
                Get Personalized Advice
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Trending Jobs */}
      <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Job Categories Worldwide
            </CardTitle>
          </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'Software Development', 'Data Science', 'Digital Marketing', 'Cloud Computing',
              'AI/ML Engineer', 'Product Management', 'UI/UX Design', 'DevOps',
              'Business Analyst', 'Full Stack Developer'
            ].map((category) => (
              <Badge key={category} variant="secondary" className="hover-scale cursor-pointer">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}