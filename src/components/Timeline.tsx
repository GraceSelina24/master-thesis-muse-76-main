import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Timeline = () => {
  const milestones = [
    { date: '2024 Q1', title: 'Research Proposal', status: 'completed' },
    { date: '2024 Q2', title: 'Literature Review', status: 'in-progress' },
    { date: '2024 Q3', title: 'Methodology', status: 'upcoming' },
    { date: '2024 Q4', title: 'Data Collection', status: 'upcoming' },
  ];

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>Research Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-secondary">
                {milestone.date}
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    milestone.status === 'completed'
                      ? 'bg-primary'
                      : milestone.status === 'in-progress'
                      ? 'bg-accent'
                      : 'bg-secondary/30'
                  }`}
                />
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{milestone.title}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Timeline;