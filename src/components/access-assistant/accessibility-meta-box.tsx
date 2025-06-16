"use client";

import React from 'react';
import type { AnalyzeAccessibilityOutput } from '@/ai/flows/analyze-accessibility';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IssueTypeIcon } from '@/components/icons/issue-type-icon';
import { Separator } from '../ui/separator';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';

interface AccessibilityMetaBoxProps {
  analysisResult: AnalyzeAccessibilityOutput | null;
  isLoading: boolean;
}

const getScoreFillColor = (value: number): string => {
  if (value < 50) return 'hsl(var(--score-low))';
  if (value < 80) return 'hsl(var(--score-medium))';
  return 'hsl(var(--score-high))';
};

export const AccessibilityMetaBox: React.FC<AccessibilityMetaBoxProps> = ({ analysisResult, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full bg-card/60 backdrop-blur-lg shadow-xl border-border/30">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Accessibility Check</CardTitle>
          <CardDescription>Analyzing content...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return (
      <Card className="w-full bg-card/60 backdrop-blur-lg shadow-xl border-border/30">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Accessibility Check</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Enter content and click "Analyze" to see accessibility insights.</p>
        </CardContent>
      </Card>
    );
  }

  const { score, issues, suggestions } = analysisResult;
  const scoreData = [{ name: 'score', value: score, fill: getScoreFillColor(score) }];

  const handleSuggestFix = (issue: AnalyzeAccessibilityOutput['issues'][number]) => {
    // Placeholder for now. This will be connected to an AI flow.
    console.log('Suggest fix for issue:', issue);
    // Potentially call suggestAltText({ imageDataUri: '...', existingAltText: '...' }) if it's an image issue
    // and we have a way to get the image data or relevant context.
  };

  return (
    <Card className="w-full bg-card/70 backdrop-blur-xl shadow-2xl border-border/30 rounded-lg overflow-hidden">
      <CardHeader className="bg-slate-500/5">
        <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
          Accessibility Insights
        </CardTitle>
        <CardDescription>Review the accessibility status of your content.</CardDescription>
      </CardHeader>
      
      <ScrollArea className="h-[calc(100vh-200px)] md:h-auto md:max-h-[70vh]">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-1 font-headline text-center">Overall Score</h3>
            <div className="w-36 h-36 mx-auto my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  barSize={12}
                  data={scoreData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar
                    background={{ fill: 'hsl(var(--muted))' }}
                    dataKey="value"
                    cornerRadius={6}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-primary">
                    {score}
                  </text>
                   <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-muted-foreground">
                    / 100
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {score >= 80 ? "Great job!" : score >= 50 ? "Some improvements needed." : "Needs significant improvement."}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3 font-headline">Identified Issues ({issues.length})</h3>
            {issues.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {issues.map((issue, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="border-border/50">
                    <AccordionTrigger className="hover:bg-muted/30 px-2 rounded-md transition-colors">
                      <div className="flex items-center gap-2 text-left">
                        <IssueTypeIcon type={issue.type} className="w-5 h-5 text-destructive" />
                        <span className="font-medium">{issue.type}</span>
                        {issue.location && <Badge variant="outline" className="ml-auto text-xs hidden sm:inline-block">{issue.location}</Badge>}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 py-3 bg-muted/10 rounded-b-md">
                      <p className="text-sm text-foreground/80">{issue.message}</p>
                      {issue.location && <p className="text-xs text-muted-foreground mt-1">Location: {issue.location}</p>}
                      {issue.type.toLowerCase().includes('alt text') && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground"
                          onClick={() => handleSuggestFix(issue)}
                        >
                          <Sparkles className="mr-2 h-4 w-4" /> Suggest Fix
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">No specific issues found. Well done!</p>
            )}
          </div>

          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3 font-headline">Suggestions for Improvement</h3>
            {suggestions.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside pl-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-foreground/90">{suggestion}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No specific suggestions at this time. Content looks good!</p>
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};
