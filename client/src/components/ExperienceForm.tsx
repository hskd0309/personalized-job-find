import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  id?: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  location: string;
}

interface ExperienceFormProps {
  onExperienceAdded: () => void;
  experiences: Experience[];
}

export function ExperienceForm({ onExperienceAdded, experiences }: ExperienceFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('experiences')
        .insert([{
          ...formData,
          user_id: user.id,
          end_date: formData.is_current ? null : formData.end_date
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Experience added successfully",
      });

      setFormData({
        company_name: '',
        position: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        location: ''
      });
      setOpen(false);
      onExperienceAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add experience",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
      onExperienceAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="border-l-2 border-primary pl-4 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0"
              onClick={() => deleteExperience(exp.id!)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <h4 className="font-semibold">{exp.position}</h4>
            <p className="text-muted-foreground">
              {exp.company_name} • {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
            </p>
            {exp.location && <p className="text-sm text-muted-foreground">{exp.location}</p>}
            {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
          </div>
        ))}
      </div>

      {/* Add Experience Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Work Experience</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Job Title</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company_name">Company</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="month"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="month"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  disabled={formData.is_current}
                  required={!formData.is_current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_current"
                checked={formData.is_current}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_current: checked as boolean }))}
              />
              <Label htmlFor="is_current">I currently work here</Label>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Experience'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}