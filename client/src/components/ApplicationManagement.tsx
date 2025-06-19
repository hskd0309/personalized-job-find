import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Application {
  id: string;
  user_id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  location: string;
  status: string;
  applied_date: string;
  notes: string;
  resume_url: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    skills: string[];
  } | null;
}

interface ApplicationManagementProps {
  jobId: string;
  jobTitle: string;
}

export function ApplicationManagement({ jobId, jobTitle }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email,
            skills
          )
        `)
        .eq('job_id', jobId)
        .order('applied_date', { ascending: false });

      if (error) throw error;
      setApplications((data || []) as any);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus}`,
      });

      loadApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-500';
      case 'Under Review': return 'bg-yellow-500';
      case 'Interview Scheduled': return 'bg-purple-500';
      case 'Accepted': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      case 'Interview Scheduled': return <Clock className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Applications for {jobTitle}</h2>
          <p className="text-muted-foreground">{applications.length} total applications</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground">Applications will appear here when candidates apply to this job.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {application.profiles?.first_name?.[0] || 'U'}
                        {application.profiles?.last_name?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {application.profiles?.first_name} {application.profiles?.last_name}
                        </h3>
                        <Badge className={`${getStatusColor(application.status)} text-white`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {application.status}
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-2">{application.profiles?.email}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied {new Date(application.applied_date).toLocaleDateString()}
                        </div>
                      </div>

                      {application.profiles?.skills && application.profiles.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {application.profiles.skills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {application.profiles.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{application.profiles.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {application.notes && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{application.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {application.resume_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(application.resume_url, '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Resume
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Manage Application</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="text-center">
                            <h3 className="font-semibold">
                              {application.profiles?.first_name} {application.profiles?.last_name}
                            </h3>
                            <p className="text-muted-foreground">{application.profiles?.email}</p>
                          </div>
                          
                          <div className="grid gap-2">
                            <Button
                              variant={application.status === 'Under Review' ? 'default' : 'outline'}
                              onClick={() => updateApplicationStatus(application.id, 'Under Review')}
                              className="justify-start"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Under Review
                            </Button>
                            
                            <Button
                              variant={application.status === 'Interview Scheduled' ? 'default' : 'outline'}
                              onClick={() => updateApplicationStatus(application.id, 'Interview Scheduled')}
                              className="justify-start"
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Schedule Interview
                            </Button>
                            
                            <Button
                              variant={application.status === 'Accepted' ? 'default' : 'outline'}
                              onClick={() => updateApplicationStatus(application.id, 'Accepted')}
                              className="justify-start bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            
                            <Button
                              variant={application.status === 'Rejected' ? 'default' : 'outline'}
                              onClick={() => updateApplicationStatus(application.id, 'Rejected')}
                              className="justify-start bg-red-500 hover:bg-red-600 text-white"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}