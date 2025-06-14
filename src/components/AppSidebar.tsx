import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, 
  Search, 
  Building, 
  FileText, 
  MessageSquare, 
  User, 
  Briefcase,
  LogOut,
  Target,
  Brain,
  Users,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const jobSeekerMenuItems = [
  {
    title: "Dashboard",
    url: "/app",
    icon: Home,
  },
  {
    title: "Job Search",
    url: "/app/job-search",
    icon: Search,
  },
  {
    title: "Resume Builder",
    url: "/app/resume-builder",
    icon: FileText,
  },
  {
    title: "Resume Analyzer",
    url: "/app/resume-analyzer",
    icon: Brain,
  },
  {
    title: "Job Matches",
    url: "/app/job-matches",
    icon: Target,
  },
  {
    title: "Skill Gap",
    url: "/app/skill-gap",
    icon: TrendingUp,
  },
  {
    title: "Applications",
    url: "/app/applications",
    icon: Briefcase,
  },
  {
    title: "Career Chat",
    url: "/app/career-chat",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    url: "/app/profile",
    icon: User,
  },
];

const recruiterMenuItems = [
  {
    title: "Dashboard",
    url: "/app",
    icon: Home,
  },
  {
    title: "Post Jobs",
    url: "/app/recruiter",
    icon: Building,
  },
  {
    title: "Manage Jobs",
    url: "/app/job-postings",
    icon: Briefcase,
  },
  {
    title: "Applications",
    url: "/app/applications",
    icon: Users,
  },
  {
    title: "Candidates",
    url: "/app/candidates",
    icon: Target,
  },
  {
    title: "Profile",
    url: "/app/profile",
    icon: User,
  },
];

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'job_seeker' | 'recruiter';
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, user_type')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (!profile?.first_name && !profile?.last_name) return 'U';
    return `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase();
  };

  const getDisplayName = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return profile?.email || 'User';
  };

  const getMenuItems = () => {
    return profile?.user_type === 'recruiter' ? recruiterMenuItems : jobSeekerMenuItems;
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">JobPortal</h2>
            <p className="text-xs text-muted-foreground">Career Platform</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <button 
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}