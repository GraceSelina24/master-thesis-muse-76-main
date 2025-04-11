import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, BookOpen } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  collaborators: number;
  citations: number;
  lastUpdated: string;
}

const ProjectCard = ({ title, description, collaborators, citations, lastUpdated }: ProjectCardProps) => {
  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <Badge variant="outline" className="bg-accent/10 text-primary">Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-secondary mb-4">{description}</p>
        <div className="flex justify-between items-center text-sm text-secondary">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{collaborators} collaborators</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            <span>{citations} citations</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={16} />
            <span>Updated {lastUpdated}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;