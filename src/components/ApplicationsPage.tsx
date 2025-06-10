import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Building, MapPin, Clock } from 'lucide-react';

// Simulated application data
const applications = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    appliedDate: '2024-06-08',
    status: 'Under Review',
    statusColor: 'bg-yellow-500'
  },
  {
    id: '2',
    jobTitle: 'UX/UI Designer',
    company: 'TechCorp Solutions',
    location: 'Remote',
    appliedDate: '2024-06-05',
    status: 'Interview Scheduled',
    statusColor: 'bg-blue-500'
  },
  {
    id: '3',
    jobTitle: 'Data Scientist',
    company: 'DataFlow Analytics',
    location: 'Austin, TX',
    appliedDate: '2024-06-07',
    status: 'Application Submitted',
    statusColor: 'bg-green-500'
  }
];

export function ApplicationsPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
        <Badge variant="secondary">{applications.length} Active Applications</Badge>
      </div>

      <div className="grid gap-4">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{app.jobTitle}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{app.company}</span>
                  </div>
                </div>
                <Badge className={`${app.statusColor} text-white`}>
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {app.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Applied {new Date(app.appliedDate).toLocaleDateString()}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No applications yet
          </h3>
          <p className="text-muted-foreground">
            Start applying to jobs to track your applications here.
          </p>
        </div>
      )}
    </div>
  );
}