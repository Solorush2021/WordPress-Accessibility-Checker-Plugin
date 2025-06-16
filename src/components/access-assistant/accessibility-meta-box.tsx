"use client";

import React from 'react';
import type { AnalyzeAccessibilityOutput } from '@/ai/flows/analyze-accessibility';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IssueTypeIcon } from '@/components/icons/issue-type-icon';
import { Separator } from '../ui/separator';

interface AccessibilityMetaBoxProps {
  analysisResult: AnalyzeAccessibilityOutput | null;
  isLoading: boolean;
}

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

  const getScoreColor = (value: number) => {
    if (value < 50) return 'bg-red-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-green-500';
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
            <h3 className="text-lg font-semibold mb-2 font-headline">Overall Score: {score}/100</h3>
            <Progress value={score} className="w-full h-3 [&>div]:transition-all [&>div]:duration-500" indicatorClassName={getScoreColor(score)} />
            <p className="text-sm text-muted-foreground mt-1">
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
