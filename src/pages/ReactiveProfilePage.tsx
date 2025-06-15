import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Save } from 'lucide-react';
import { ReactiveButton } from '@/components/ui/reactive-button';
import { ReactiveCard, ReactiveCardHeader, ReactiveCardContent } from '@/components/ui/reactive-card';
import { ReactiveInput } from '@/components/ui/reactive-input';

export function ReactiveProfilePage() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Frontend Developer',
    bio: 'Passionate frontend developer with 5+ years of experience building scalable web applications.',
    company: 'TechCorp Inc.',
    experience: '5 years',
    education: 'Bachelor of Computer Science',
    skills: 'React, TypeScript, Node.js, AWS, Python'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
    console.log('Saving profile:', profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">Profile Settings</h1>
          <p className="text-xl text-zinc-300">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Picture & Basic Info */}
          <ReactiveCard>
            <ReactiveCardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Personal Information
                </h2>
                <ReactiveButton
                  variant={isEditing ? 'secondary' : 'outline'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </ReactiveButton>
              </div>
            </ReactiveCardHeader>
            <ReactiveCardContent>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-4">
                    <User className="h-16 w-16 text-primary-foreground" />
                  </div>
                  {isEditing && (
                    <ReactiveButton variant="outline" size="sm">
                      Change Photo
                    </ReactiveButton>
                  )}
                </div>

                {/* Basic Info Form */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ReactiveInput
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                  <ReactiveInput
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                  <ReactiveInput
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="md:col-span-2"
                  />
                  <ReactiveInput
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                  <ReactiveInput
                    label="Location"
                    value={profile.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </ReactiveCardContent>
          </ReactiveCard>

          {/* Professional Information */}
          <ReactiveCard>
            <ReactiveCardHeader>
              <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                Professional Information
              </h2>
            </ReactiveCardHeader>
            <ReactiveCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReactiveInput
                  label="Job Title"
                  value={profile.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!isEditing}
                />
                <ReactiveInput
                  label="Company"
                  value={profile.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                />
                <ReactiveInput
                  label="Years of Experience"
                  value={profile.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  disabled={!isEditing}
                />
                <ReactiveInput
                  label="Education"
                  value={profile.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  disabled={!isEditing}
                />
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300 block mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="md:col-span-2">
                  <ReactiveInput
                    label="Skills (comma-separated)"
                    value={profile.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    disabled={!isEditing}
                    placeholder="React, TypeScript, Node.js..."
                  />
                </div>
              </div>
            </ReactiveCardContent>
          </ReactiveCard>

          {/* Preferences */}
          <ReactiveCard>
            <ReactiveCardHeader>
              <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
                <Award className="h-6 w-6" />
                Job Preferences
              </h2>
            </ReactiveCardHeader>
            <ReactiveCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-2">
                    Preferred Job Type
                  </label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    disabled={!isEditing}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-2">
                    Remote Preference
                  </label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    disabled={!isEditing}
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                    <option>No preference</option>
                  </select>
                </div>
                <ReactiveInput
                  label="Desired Salary Range"
                  placeholder="$100k - $150k"
                  disabled={!isEditing}
                />
                <ReactiveInput
                  label="Preferred Location"
                  placeholder="San Francisco, CA or Remote"
                  disabled={!isEditing}
                />
              </div>
            </ReactiveCardContent>
          </ReactiveCard>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-center">
              <ReactiveButton size="lg" onClick={handleSave}>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </ReactiveButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}