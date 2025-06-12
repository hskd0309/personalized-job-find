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
        .single();

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
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={profile.first_name || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, first_name: e.target.value} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={profile.last_name || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, last_name: e.target.value} : null)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile.email || ''}
                  onChange={(e) => setProfile(prev => prev ? {...prev, email: e.target.value} : null)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={profile.location || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, location: e.target.value} : null)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea 
                  id="bio" 
                  value={profile.bio || ''}
                  onChange={(e) => setProfile(prev => prev ? {...prev, bio: e.target.value} : null)}
                  rows={4}
                  placeholder="Tell us about your professional background..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {(profile.skills || []).map((skill) => (
                  <Badge key={skill} variant="outline" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                    {skill} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-primary pl-4 relative group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-muted-foreground">
                          {exp.company_name} • {exp.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(exp.start_date).toLocaleDateString()} - {
                            exp.is_current ? 'Present' : 
                            exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'
                          }
                        </p>
                        {exp.description && (
                          <p className="text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExperience(exp.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <p className="text-muted-foreground text-sm">No experience added yet. Click the button below to add your first experience.</p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowExperienceForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
              
              {showExperienceForm && (
                <div className="mt-4 p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input 
                        id="position"
                        placeholder="Software Engineer"
                        value={newExperience.position}
                        onChange={(e) => setNewExperience(prev => ({...prev, position: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company"
                        placeholder="Company Name"
                        value={newExperience.company_name}
                        onChange={(e) => setNewExperience(prev => ({...prev, company_name: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="expLocation">Location</Label>
                    <Input 
                      id="expLocation"
                      placeholder="City, State"
                      value={newExperience.location}
                      onChange={(e) => setNewExperience(prev => ({...prev, location: e.target.value}))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate"
                        type="date"
                        value={newExperience.start_date}
                        onChange={(e) => setNewExperience(prev => ({...prev, start_date: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input 
                        id="endDate"
                        type="date"
                        value={newExperience.end_date}
                        onChange={(e) => setNewExperience(prev => ({...prev, end_date: e.target.value}))}
                        disabled={newExperience.is_current}
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
                        <Label htmlFor="current" className="text-sm">I currently work here</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Describe your role and achievements..."
                      value={newExperience.description}
                      onChange={(e) => setNewExperience(prev => ({...prev, description: e.target.value}))}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addExperience} disabled={!newExperience.position || !newExperience.company_name}>
                      Save Experience
                    </Button>
                    <Button variant="outline" onClick={() => {
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
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Strength</span>
                    <span>{profile.profile_completion}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${profile.profile_completion}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add more details to improve your profile visibility
                  </p>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Resume.pdf</span>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Button className="w-full" onClick={updateProfile} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}