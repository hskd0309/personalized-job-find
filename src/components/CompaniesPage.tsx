import { companies } from '@/data/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Building, Users, MapPin, Globe, Search } from 'lucide-react';
import { useState } from 'react';

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Company Insights</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {company.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{company.rating}</span>
                    <span className="text-muted-foreground text-sm">({company.reviewCount} reviews)</span>
                  </div>
                </div>
                <Badge variant="secondary">{company.industry}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {company.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{company.size} employees</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{company.headquarters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-primary">{company.website}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm">Benefits</h4>
                <div className="flex flex-wrap gap-1">
                  {company.benefits.slice(0, 3).map((benefit) => (
                    <Badge key={benefit} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                  {company.benefits.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{company.benefits.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm">Culture</h4>
                <div className="flex flex-wrap gap-1">
                  {company.culture.map((trait) => (
                    <Badge key={trait} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Jobs
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Read Reviews
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No companies found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}