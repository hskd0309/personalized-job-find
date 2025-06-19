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
  
  const [recentActivities, setRecentActivities] = useState<Array<{
    text: string;
    time: string;
    icon: any;
  }>>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
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

  const fetchRecentActivities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [applicationsRes, resumesRes, experiencesRes] = await Promise.all([
        supabase.from('applications').select('job_title, company_name, applied_date').eq('user_id', user.id).order('applied_date', { ascending: false }).limit(2),
        supabase.from('resumes').select('title, created_at, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(2),
        supabase.from('experiences').select('company_name, position, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
      ]);

      const activities: Array<{ text: string; time: string; icon: any }> = [];

      // Add applications
      if (applicationsRes.data) {
        applicationsRes.data.forEach(app => {
          activities.push({
            text: `Applied to ${app.job_title} at ${app.company_name}`,
            time: formatTimeAgo(app.applied_date),
            icon: Briefcase
          });
        });
      }

      // Add resume updates
      if (resumesRes.data) {
        resumesRes.data.forEach(resume => {
          const isNew = new Date(resume.created_at).getTime() === new Date(resume.updated_at).getTime();
          activities.push({
            text: isNew ? `Created resume: ${resume.title}` : `Updated resume: ${resume.title}`,
            time: formatTimeAgo(resume.updated_at),
            icon: FileText
          });
        });
      }

      // Add experience updates
      if (experiencesRes.data) {
        experiencesRes.data.forEach(exp => {
          activities.push({
            text: `Added experience: ${exp.position} at ${exp.company_name}`,
            time: formatTimeAgo(exp.created_at),
            icon: Building
          });
        });
      }

      // Sort by most recent and take top 4
      activities.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      });

      setRecentActivities(activities.slice(0, 4));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  const parseTimeAgo = (timeString: string) => {
    if (timeString === 'Just now') return 0;
    const match = timeString.match(/(\d+) (minutes?|hours?|days?|months?) ago/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit.startsWith('minute')) return value;
    if (unit.startsWith('hour')) return value * 60;
    if (unit.startsWith('day')) return value * 1440;
    if (unit.startsWith('month')) return value * 43200;
    return 0;
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            Dashboard
          </h1>
          <p className="text-zinc-400">
            Your career overview and quick actions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-emerald-600/20 flex items-center justify-center mr-4">
                <Briefcase className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-100">{stats.applications}</p>
                <p className="text-sm text-zinc-400">Applications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-blue-600/20 flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-100">{stats.resumes}</p>
                <p className="text-sm text-zinc-400">Resumes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-100">{stats.saved_jobs}</p>
                <p className="text-sm text-zinc-400">Saved Jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-zinc-100">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link to={action.href} key={action.title}>
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6 hover:bg-zinc-900/90 transition-all duration-200 cursor-pointer group">
                  <div className="text-center space-y-4">
                    <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center mx-auto shadow-lg`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-zinc-100">{action.title}</h3>
                      <p className="text-sm text-zinc-400">{action.description}</p>
                    </div>
                    <button className="w-full px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-colors duration-200 text-sm">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2 inline" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
            <div className="flex items-center gap-2 text-zinc-100 mb-6">
              <Clock className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/30">
                  <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <activity.icon className="h-4 w-4 text-zinc-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-100">{activity.text}</p>
                    <p className="text-xs text-zinc-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Tips */}
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
            <div className="flex items-center gap-2 text-zinc-100 mb-6">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Global Career Tips</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-600/20 border-l-4 border-emerald-400">
                  <h4 className="font-medium text-emerald-400">Networking is Key</h4>
                  <p className="text-sm text-zinc-400">Join professional groups on LinkedIn and attend virtual meetups.</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-600/20 border-l-4 border-blue-400">
                  <h4 className="font-medium text-blue-400">Skill Development</h4>
                  <p className="text-sm text-zinc-400">Focus on in-demand skills like AI, Data Science, and Cloud Computing.</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-600/20 border-l-4 border-purple-400">
                  <h4 className="font-medium text-purple-400">Resume Optimization</h4>
                  <p className="text-sm text-zinc-400">Tailor your resume for each application with relevant keywords.</p>
                </div>
              </div>
              <Link to="/app/career-chat">
                <button className="w-full px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium">
                  Get Personalized Advice
                  <ArrowRight className="h-4 w-4 ml-2 inline" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Trending Jobs */}
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
          <div className="flex items-center gap-2 text-zinc-100 mb-6">
            <TrendingUp className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Trending Job Categories Worldwide</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Software Development', 'Data Science', 'Digital Marketing', 'Cloud Computing',
              'AI/ML Engineer', 'Product Management', 'UI/UX Design', 'DevOps',
              'Business Analyst', 'Full Stack Developer'
            ].map((category, index) => (
              <span 
                key={category} 
                className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors duration-200"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}