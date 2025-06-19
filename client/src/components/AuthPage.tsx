import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogIn, UserPlus, Mail, Lock, User, Building, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'job_seeker' as 'job_seeker' | 'recruiter',
    companyName: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      onAuthSuccess();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName,
            user_type: signupData.userType,
            company_name: signupData.userType === 'recruiter' ? signupData.companyName : null
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center">
              <img src="/icons/careerhub-icon.svg" alt="CareerHub" className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">CareerHub</h1>
          </div>
          <p className="text-zinc-400 mt-2">AI-Powered Career Platform</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800 border-zinc-700">
            <TabsTrigger value="login" className="flex items-center gap-2 data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 text-zinc-400">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2 data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 text-zinc-400">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-800/50 p-6 mt-4">
              <div className="pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Welcome Back
                </h2>
              </div>
              <div className="pt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 pl-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <input
                        id="login-password"
                        type="password"
                        placeholder="Your password"
                        className="w-full px-3 py-2 pl-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium disabled:opacity-50" 
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-800/50 p-6 mt-4">
              <div className="pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Create Account
                </h2>
              </div>
              <div className="pt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <input
                          id="signup-firstName"
                          placeholder="First name"
                          className="w-full px-3 py-2 pl-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                          value={signupData.firstName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Last Name</label>
                      <input
                        id="signup-lastName"
                        placeholder="Last name"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">I am a</label>
                    <Select 
                      value={signupData.userType} 
                      onValueChange={(value: 'job_seeker' | 'recruiter') => 
                        setSignupData(prev => ({ ...prev, userType: value }))
                      }
                    >
                      <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700 text-zinc-100">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="job_seeker" className="text-zinc-100 hover:bg-zinc-700">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Job Seeker
                          </div>
                        </SelectItem>
                        <SelectItem value="recruiter" className="text-zinc-100 hover:bg-zinc-700">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Company/Recruiter
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {signupData.userType === 'recruiter' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <input
                          id="signup-companyName"
                          placeholder="Your company name"
                          className="w-full px-3 py-2 pl-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                          value={signupData.companyName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, companyName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  )}
                   
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 pl-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <input
                        id="signup-password"
                        type="password"
                        placeholder="Create password"
                        className="w-full px-3 py-2 pl-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <input
                        id="signup-confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        className="w-full px-3 py-2 pl-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium disabled:opacity-50" 
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}