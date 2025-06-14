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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Career Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personalized career hub with AI-powered insights and opportunities
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex items-center p-8">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mr-6 shadow-lg">
                <Briefcase className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground mb-1">{stats.applications}</p>
                <p className="text-base text-muted-foreground font-medium">Applications</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex items-center p-8">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-secondary to-green-600 flex items-center justify-center mr-6 shadow-lg">
                <FileText className="h-8 w-8 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground mb-1">{stats.resumes}</p>
                <p className="text-base text-muted-foreground font-medium">Resumes</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex items-center p-8">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center mr-6 shadow-lg">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground mb-1">{stats.saved_jobs}</p>
                <p className="text-base text-muted-foreground font-medium">Saved Jobs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickActions.slice(0, 6).map((action, index) => (
              <Link to={action.href} key={action.title}>
                <Card className="cursor-pointer bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50 group-hover:opacity-80 transition-opacity"></div>
                  <CardContent className="p-8 text-center space-y-6 relative z-10">
                    <div className={`h-20 w-20 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mx-auto shadow-xl transform group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      Get Started
                      <ArrowRight className="h-5 w-5 ml-2" />
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
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-primary">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 hover:shadow-md transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <activity.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{activity.text}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Career Tips */}
          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-secondary">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary to-green-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Global Career Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-primary shadow-sm">
                  <h4 className="font-bold text-primary text-lg mb-2">Networking is Key</h4>
                  <p className="text-muted-foreground">Join professional groups on LinkedIn and attend virtual meetups.</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-secondary shadow-sm">
                  <h4 className="font-bold text-secondary text-lg mb-2">Skill Development</h4>
                  <p className="text-muted-foreground">Focus on in-demand skills like AI, Data Science, and Cloud Computing.</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-accent shadow-sm">
                  <h4 className="font-bold text-accent text-lg mb-2">Resume Optimization</h4>
                  <p className="text-muted-foreground">Tailor your resume for each application with relevant keywords.</p>
                </div>
              </div>
              <Link to="/app/career-chat">
                <Button className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  Get Personalized Advice
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Trending Jobs */}
        <Card className="bg-white/90 backdrop-blur-sm border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-accent">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Trending Job Categories Worldwide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {[
                'Software Development', 'Data Science', 'Digital Marketing', 'Cloud Computing',
                'AI/ML Engineer', 'Product Management', 'UI/UX Design', 'DevOps',
                'Business Analyst', 'Full Stack Developer'
              ].map((category, index) => (
                <Badge 
                  key={category} 
                  className="cursor-pointer bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}