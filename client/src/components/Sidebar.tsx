import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Search, 
  User, 
  FileText, 
  Building, 
  MessageSquare, 
  BookOpen,
  LogOut 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  { name: 'Job Search', href: '/job-search', icon: Search },
  { name: 'My Profile', href: '/profile', icon: User },
  { name: 'Resume Builder', href: '/resume-builder', icon: FileText },
  { name: 'My Applications', href: '/applications', icon: BookOpen },
  { name: 'Companies', href: '/companies', icon: Building },
  { name: 'AI Career Chat', href: '/career-chat', icon: MessageSquare },
];

interface SidebarProps {
  user: any;
  onLogout: () => void;
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">CareerHub</h2>
        {user && (
          <p className="text-sm text-muted-foreground">
            Welcome, {user.email}
          </p>
        )}
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {user && (
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}