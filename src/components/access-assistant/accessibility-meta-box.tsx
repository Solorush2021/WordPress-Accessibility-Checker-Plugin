
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
import { Sparkles, CheckCircle, AlertTriangle, Info } from 'lucide-react';
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

const getScoreIcon = (value: number) => {
  if (value < 50) return <AlertTriangle className="h-5 w-5 text-destructive" />;
  if (value < 80) return <Info className="h-5 w-5 text-yellow-500" />; // Using a specific color here for emphasis
  return <CheckCircle className="h-5 w-5 text-green-500" />; // Using a specific color here for emphasis
};


export const AccessibilityMetaBox: React.FC<AccessibilityMetaBoxProps> = ({ analysisResult, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full bg-card/80 backdrop-blur-xl shadow-2xl border-border/40 rounded-lg flex flex-col flex-grow">
        <CardHeader className="pb-4">
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            Accessibility Check
          </CardTitle>
          <CardDescription>Analyzing your content, please wait...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center justify-center flex-grow min-h-[300px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <p className="text-lg text-muted-foreground animate-pulse">Scanning for issues...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return (
      <Card className="w-full bg-card/80 backdrop-blur-xl shadow-2xl border-border/40 rounded-lg flex flex-col flex-grow">
        <CardHeader className="pb-4">
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            Accessibility Check
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center flex-grow">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Enter content in the editor and click "Analyze Content" to see accessibility insights.
          </p>
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
    <Card className="w-full bg-card/80 backdrop-blur-xl shadow-2xl border-border/40 rounded-lg overflow-hidden flex flex-col flex-grow">
      <CardHeader className="bg-slate-500/10 pb-4">
        <CardTitle className="font-headline text-2xl md:text-3xl text-primary flex items-center gap-2">
          Accessibility Insights
        </CardTitle>
        <CardDescription>A summary of the accessibility status of your content.</CardDescription>
      </CardHeader>
      
      <ScrollArea className="flex-grow">
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 font-headline flex items-center justify-center gap-2">
              {getScoreIcon(score)} Overall Score
            </h3>
            <div className="w-40 h-40 md:w-48 md:h-48 mx-auto my-3">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  barSize={14}
                  data={scoreData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar
                    background={{ fill: 'hsl(var(--muted)/0.3)' }}
                    dataKey="value"
                    cornerRadius={7}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl md:text-4xl font-bold fill-primary">
                    {score}
                  </text>
                   <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-muted-foreground">
                    / 100
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-md text-muted-foreground mt-2">
              {score >= 80 ? "Excellent! Your content is highly accessible." : score >= 50 ? "Good, but some improvements can be made." : "Needs significant improvement for better accessibility."}
            </p>
          </div>

          <Separator className="my-6 border-border/50" />

          <div>
            <h3 className="text-xl font-semibold mb-4 font-headline">Identified Issues ({issues.length})</h3>
            {issues.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {issues.map((issue, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="border border-border/40 rounded-md shadow-sm bg-background/30 hover:bg-muted/20 transition-colors">
                    <AccordionTrigger className="hover:bg-muted/30 px-3 py-3 rounded-t-md transition-colors data-[state=open]:bg-muted/20">
                      <div className="flex items-center gap-3 text-left w-full">
                        <IssueTypeIcon type={issue.type} className="w-6 h-6 text-destructive flex-shrink-0" />
                        <span className="font-medium text-base text-foreground/90 flex-grow">{issue.type}</span>
                        {issue.location && <Badge variant="outline" className="ml-auto text-xs hidden sm:inline-block py-1 px-2 border-primary/50 text-primary">{issue.location}</Badge>}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 py-4 bg-muted/10 rounded-b-md border-t border-border/30">
                      <p className="text-sm text-foreground/80 mb-2">{issue.message}</p>
                      {issue.location && <p className="text-xs text-muted-foreground mt-1">Location: {issue.location}</p>}
                      {issue.type.toLowerCase().includes('alt text') && ( // Example condition
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground hover:shadow-md transition-all duration-150 ease-in-out"
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
              <div className="text-center py-6 bg-muted/20 rounded-md">
                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <p className="text-muted-foreground">No specific issues found. Fantastic job!</p>
              </div>
            )}
          </div>

          {suggestions.length > 0 && <Separator className="my-6 border-border/50" />}
          
          {suggestions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 font-headline">Suggestions for Improvement</h3>
              <ul className="space-y-3 list-none pl-0">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-foreground/90 flex items-start gap-2 p-3 bg-muted/20 rounded-md">
                    <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};
