import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  Bell, 
  Shield,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [notifications, setNotifications] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    // Apply theme to document
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast({
      title: `Switched to ${checked ? 'dark' : 'light'} mode`,
      description: "Theme preference saved",
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
      
      // Don't reload - let the auth state change handle the redirect
      onClose();
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-100">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-medium text-zinc-200">Appearance</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm text-zinc-300">Dark Mode</Label>
                <p className="text-xs text-zinc-500">Toggle between light and dark themes</p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-zinc-400" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                  className="data-[state=checked]:bg-zinc-600"
                />
                <Moon className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-medium text-zinc-200">Notifications</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm text-zinc-300">Push Notifications</Label>
                <p className="text-xs text-zinc-500">Receive notifications about job matches</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-zinc-600"
              />
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Privacy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-medium text-zinc-200">Privacy</h3>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                Manage Profile Visibility
              </Button>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Account Actions */}
          <div className="space-y-4">
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}