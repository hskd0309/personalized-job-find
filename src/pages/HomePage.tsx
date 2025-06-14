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
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Your career overview and quick actions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.applications}</p>
              <p className="text-sm text-muted-foreground">Applications</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.resumes}</p>
              <p className="text-sm text-muted-foreground">Resumes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-accent" />
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
        <h2 className="text-2xl font-semibold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link to={action.href} key={action.title}>
              <Card className="cursor-pointer hover:shadow-xl border-0 bg-gradient-to-br from-background via-secondary/5 to-accent/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0"></div>
                <CardContent className="p-6 text-center space-y-4 relative z-10">
                  <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center mx-auto shadow-lg`}>
                    <action.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                   <Button variant="outline" size="sm" className="w-full group border-gray-300 hover:border-black hover:bg-black hover:text-white">
                     Get Started
                     <ArrowRight className="h-4 w-4 ml-2" />
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
        <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-secondary/10 border border-transparent">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
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
        <Card className="bg-gradient-to-br from-background to-secondary/5 border-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Users className="h-5 w-5" />
              Global Career Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-blue-500/10 border-l-4 border-primary">
                <h4 className="font-medium text-primary">Networking is Key</h4>
                <p className="text-sm text-muted-foreground">Join professional groups on LinkedIn and attend virtual meetups.</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-secondary/10 to-green-500/10 border-l-4 border-secondary">
                <h4 className="font-medium text-primary">Skill Development</h4>
                <p className="text-sm text-muted-foreground">Focus on in-demand skills like AI, Data Science, and Cloud Computing.</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-accent/10 to-purple-500/10 border-l-4 border-accent">
                <h4 className="font-medium text-primary">Resume Optimization</h4>
                <p className="text-sm text-muted-foreground">Tailor your resume for each application with relevant keywords.</p>
              </div>
            </div>
            <Link to="/app/career-chat">
              <Button className="w-full bg-black hover:bg-gray-600 text-white">
                Get Personalized Advice
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Trending Jobs */}
      <Card className="bg-gradient-to-br from-background via-accent/5 to-primary/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
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
            ].map((category, index) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border-0"
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}