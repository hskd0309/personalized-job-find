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
      href: '/app/job-recommendations',
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
    <div className="container mx-auto px-4 py-6 space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-lg -skew-y-1 animate-pulse"></div>
        <div className="relative z-10 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-scale-in">
            Welcome to Global JobPortal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Your AI-powered career companion for finding dream jobs worldwide. Build resumes, track applications, and get personalized career guidance.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-scale bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 animate-fade-in">
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center mr-4 animate-pulse">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground animate-scale-in">{stats.applications}</p>
              <p className="text-sm text-muted-foreground">Applications</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale bg-gradient-to-r from-secondary/10 to-green-500/10 border-secondary/20 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-secondary to-green-500 flex items-center justify-center mr-4 animate-pulse" style={{animationDelay: '0.5s'}}>
              <FileText className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground animate-scale-in" style={{animationDelay: '0.3s'}}>{stats.resumes}</p>
              <p className="text-sm text-muted-foreground">Resumes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/20 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-accent to-purple-500 flex items-center justify-center mr-4 animate-pulse" style={{animationDelay: '1s'}}>
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground animate-scale-in" style={{animationDelay: '0.5s'}}>{stats.saved_jobs}</p>
              <p className="text-sm text-muted-foreground">Saved Jobs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-slide-in-right">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link to={action.href} key={action.title}>
              <Card className="hover-scale cursor-pointer transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-background via-secondary/5 to-accent/5 animate-fade-in relative overflow-hidden group" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:skew-x-12"></div>
                <CardContent className="p-6 text-center space-y-4 relative z-10">
                  <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center mx-auto animate-pulse shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`} style={{animationDelay: `${index * 0.2}s`}}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full group border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground">
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
        <Card className="animate-slide-in-right bg-gradient-to-br from-background to-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5 animate-pulse" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-secondary/10 hover:from-primary/10 hover:to-secondary/20 transition-all duration-300 animate-fade-in border border-transparent hover:border-primary/20" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse" style={{animationDelay: `${index * 0.2}s`}}>
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
        <Card className="animate-slide-in-right bg-gradient-to-br from-background to-secondary/5 border-secondary/10" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <Users className="h-5 w-5 animate-pulse" />
              Global Career Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-blue-500/10 border-l-4 border-primary animate-fade-in hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300">
                <h4 className="font-medium text-primary">Networking is Key</h4>
                <p className="text-sm text-muted-foreground">Join professional groups on LinkedIn and attend virtual meetups.</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-secondary/10 to-green-500/10 border-l-4 border-secondary animate-fade-in hover:from-secondary/20 hover:to-green-500/20 transition-all duration-300" style={{animationDelay: '0.1s'}}>
                <h4 className="font-medium text-secondary">Skill Development</h4>
                <p className="text-sm text-muted-foreground">Focus on in-demand skills like AI, Data Science, and Cloud Computing.</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-accent/10 to-purple-500/10 border-l-4 border-accent animate-fade-in hover:from-accent/20 hover:to-purple-500/20 transition-all duration-300" style={{animationDelay: '0.2s'}}>
                <h4 className="font-medium text-accent">Resume Optimization</h4>
                <p className="text-sm text-muted-foreground">Tailor your resume for each application with relevant keywords.</p>
              </div>
            </div>
            <Link to="/app/career-chat">
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 animate-scale-in">
                Get Personalized Advice
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Trending Jobs */}
      <Card className="animate-fade-in bg-gradient-to-br from-background via-accent/5 to-primary/5 border-accent/20" style={{animationDelay: '0.6s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <TrendingUp className="h-5 w-5 animate-pulse" />
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
                className="hover-scale cursor-pointer bg-gradient-to-r from-secondary/80 to-accent/80 hover:from-secondary hover:to-accent text-secondary-foreground border-0 animate-fade-in" 
                style={{animationDelay: `${index * 0.05}s`}}
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