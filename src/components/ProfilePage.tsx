import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, FileText, Plus, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  experience: any;
  profile_completion: number;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

interface Experience {
  id: string;
  position: string;
  company_name: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [newExperience, setNewExperience] = useState({
    position: '',
    company_name: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchExperiences();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create default profile if none exists
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            user_id: user.id,
            email: user.email || '',
            first_name: '',
            last_name: '',
            phone: '',
            location: 'India',
            bio: '',
            skills: [],
            experience: []
          }])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error: any) {
      console.error('Error fetching experiences:', error);
    }
  };

  const addExperience = async () => {
    if (!newExperience.position || !newExperience.company_name) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('experiences')
        .insert([{
          user_id: user.id,
          ...newExperience
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Experience added successfully",
      });

      setNewExperience({
        position: '',
        company_name: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: ''
      });
      setShowExperienceForm(false);
      fetchExperiences();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add experience",
        variant: "destructive",
      });
    }
  };

  const removeExperience = async (experienceId: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experienceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Experience removed successfully",
      });

      fetchExperiences();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove experience",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          skills: profile.skills,
          experience: profile.experience,
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim() || !profile) return;
    
    setProfile(prev => prev ? {
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    } : null);
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => prev ? {
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    } : null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-zinc-100">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
              <div className="flex items-center gap-2 text-zinc-100 mb-4">
                <User className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Personal Information</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">First Name</label>
                    <input 
                      id="firstName" 
                      value={profile.first_name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, first_name: e.target.value} : null)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Last Name</label>
                    <input 
                      id="lastName" 
                      value={profile.last_name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, last_name: e.target.value} : null)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Email</label>
                  <input 
                    id="email" 
                    type="email" 
                    value={profile.email || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, email: e.target.value} : null)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Phone</label>
                    <input 
                      id="phone" 
                      value={profile.phone || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Location</label>
                    <input 
                      id="location" 
                      value={profile.location || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, location: e.target.value} : null)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Professional Bio</label>
                  <textarea 
                    id="bio" 
                    value={profile.bio || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, bio: e.target.value} : null)}
                    rows={4}
                    placeholder="Tell us about your professional background..."
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
              <div className="flex items-center gap-2 text-zinc-100 mb-4">
                <h2 className="text-lg font-semibold">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(profile.skills || []).map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 cursor-pointer hover:bg-zinc-700" onClick={() => removeSkill(skill)}>
                    {skill} ×
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                />
                <button 
                  onClick={addSkill}
                  className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors duration-200 text-sm"
                >
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Add
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
              <div className="flex items-center gap-2 text-zinc-100 mb-4">
                <h2 className="text-lg font-semibold">Experience</h2>
              </div>
              <div className="space-y-4 mb-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-emerald-400 pl-4 relative group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-zinc-100">{exp.position}</h4>
                        <p className="text-zinc-400">
                          {exp.company_name} • {exp.location}
                        </p>
                        <p className="text-sm text-zinc-400">
                          {new Date(exp.start_date).toLocaleDateString()} - {
                            exp.is_current ? 'Present' : 
                            exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'
                          }
                        </p>
                        {exp.description && (
                          <p className="text-sm mt-2 text-zinc-300">{exp.description}</p>
                        )}
                      </div>
                      <button 
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-zinc-400 hover:text-zinc-200"
                        onClick={() => removeExperience(exp.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <p className="text-zinc-400 text-sm">No experience added yet. Click the button below to add your first experience.</p>
                )}
              </div>
              <button 
                onClick={() => setShowExperienceForm(true)}
                className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors duration-200 text-sm"
              >
                <Plus className="h-4 w-4 mr-2 inline" />
                Add Experience
              </button>
              
              {showExperienceForm && (
                <div className="mt-4 p-4 border border-zinc-700 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">Position</label>
                      <input 
                        id="position"
                        placeholder="Software Engineer"
                        value={newExperience.position}
                        onChange={(e) => setNewExperience(prev => ({...prev, position: e.target.value}))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">Company</label>
                      <input 
                        id="company"
                        placeholder="Company Name"
                        value={newExperience.company_name}
                        onChange={(e) => setNewExperience(prev => ({...prev, company_name: e.target.value}))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Location</label>
                    <input 
                      id="expLocation"
                      placeholder="City, State"
                      value={newExperience.location}
                      onChange={(e) => setNewExperience(prev => ({...prev, location: e.target.value}))}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">Start Date</label>
                      <input 
                        id="startDate"
                        type="date"
                        value={newExperience.start_date}
                        onChange={(e) => setNewExperience(prev => ({...prev, start_date: e.target.value}))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">End Date</label>
                      <input 
                        id="endDate"
                        type="date"
                        value={newExperience.end_date}
                        onChange={(e) => setNewExperience(prev => ({...prev, end_date: e.target.value}))}
                        disabled={newExperience.is_current}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                      />
                      <div className="flex items-center mt-2">
                        <input 
                          type="checkbox" 
                          id="current"
                          checked={newExperience.is_current}
                          onChange={(e) => setNewExperience(prev => ({
                            ...prev, 
                            is_current: e.target.checked,
                            end_date: e.target.checked ? '' : prev.end_date
                          }))}
                          className="mr-2"
                        />
                        <label htmlFor="current" className="text-sm text-zinc-300">I currently work here</label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Description</label>
                    <textarea 
                      id="description"
                      placeholder="Describe your role and achievements..."
                      value={newExperience.description}
                      onChange={(e) => setNewExperience(prev => ({...prev, description: e.target.value}))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={addExperience} 
                      disabled={!newExperience.position || !newExperience.company_name}
                      className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium disabled:opacity-50"
                    >
                      Save Experience
                    </button>
                    <button 
                      onClick={() => {
                        setShowExperienceForm(false);
                        setNewExperience({
                          position: '',
                          company_name: '',
                          location: '',
                          start_date: '',
                          end_date: '',
                          is_current: false,
                          description: ''
                        });
                      }}
                      className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
              <div className="flex items-center gap-2 text-zinc-100 mb-4">
                <h2 className="text-lg font-semibold">Profile Completion</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">Profile Strength</span>
                  <span className="text-zinc-100">{profile.profile_completion}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full transition-all duration-300" style={{ width: `${profile.profile_completion}%` }}></div>
                </div>
                <p className="text-xs text-zinc-400">
                  Add more details to improve your profile visibility
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
              <div className="flex items-center gap-2 text-zinc-100 mb-4">
                <h2 className="text-lg font-semibold">Documents</h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border border-zinc-700 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm text-zinc-300">Resume.pdf</span>
                  </div>
                  <button className="text-sm text-zinc-400 hover:text-zinc-200">View</button>
                </div>
                <button className="w-full px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors duration-200 text-sm">
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Upload Document
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-6">
              <button 
                className="w-full px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium disabled:opacity-50" 
                onClick={updateProfile} 
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2 inline" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}