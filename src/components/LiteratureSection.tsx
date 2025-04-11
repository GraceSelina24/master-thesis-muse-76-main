import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Star } from 'lucide-react';

const LiteratureSection = () => {
  const papers = [
    {
      title: "Machine Learning Applications in Research Management",
      authors: "Smith, J., Johnson, M.",
      year: 2023,
      relevance: "high",
    },
    {
      title: "Academic Project Management: A Systematic Review",
      authors: "Williams, R., et al.",
      year: 2023,
      relevance: "medium",
    },
    {
      title: "Collaborative Research Platforms: Current State",
      authors: "Brown, A., Davis, K.",
      year: 2022,
      relevance: "high",
    },
  ];

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>Literature Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {papers.map((paper, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-accent/5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 text-secondary" size={20} />
                  <div>
                    <h3 className="font-medium">{paper.title}</h3>
                    <p className="text-sm text-secondary mt-1">
                      {paper.authors} ({paper.year})
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    paper.relevance === 'high'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary/10 text-secondary'
                  }`}
                >
                  <Star className="mr-1" size={12} />
                  {paper.relevance}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiteratureSection;