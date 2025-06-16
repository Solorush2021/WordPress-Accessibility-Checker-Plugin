
"use client";

import React, { useState } from 'react';
import type { AnalyzeAccessibilityOutput } from '@/ai/flows/analyze-accessibility';
import { suggestAltText, type SuggestAltTextInput } from '@/ai/flows/suggest-alt-text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IssueTypeIcon } from '@/components/icons/issue-type-icon';
import { Separator } from '../ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, CheckCircle, AlertTriangle, Info, Loader2, Eye, EyeOff } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';

interface AccessibilityMetaBoxProps {
  analysisResult: AnalyzeAccessibilityOutput | null;
  isLoading: boolean;
  content: string; 
  onApplySuggestion: (newContent: string) => void;
}

const getScoreFillColor = (value: number): string => {
  if (value < 50) return 'hsl(var(--score-low))';
  if (value < 80) return 'hsl(var(--score-medium))';
  return 'hsl(var(--score-high))';
};

const getScoreIcon = (value: number) => {
  if (value < 50) return <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />;
  if (value < 80) return <Info className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />;
  return <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />;
};

async function imageUrlToDataUri(url: string): Promise<string> {
  try {
    const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch image via proxy: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image URL to Data URI:", error);
    throw error;
  }
}

export const AccessibilityMetaBox: React.FC<AccessibilityMetaBoxProps> = ({ analysisResult, isLoading, content, onApplySuggestion }) => {
  const { toast } = useToast();
  const [suggestingFixFor, setSuggestingFixFor] = useState<string | null>(null);
  const [showPreviewPanel, setShowPreviewPanel] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'before' | 'after'>('before');
  const [afterContent, setAfterContent] = useState<string>('');

  const handleSuggestFix = async (issue: AnalyzeAccessibilityOutput['issues'][number], issueIndex: number) => {
    const issueKey = `${issue.type}-${issueIndex}`;
    setSuggestingFixFor(issueKey);

    if (issue.type.toLowerCase().includes('alt text') && issue.elementContext) {
      const imageSrc = issue.elementContext;
      try {
        const imageDataUri = await imageUrlToDataUri(imageSrc);
        const suggestionInput: SuggestAltTextInput = {
          imageDataUri: imageDataUri,
          existingAltText: '', 
        };
        const result = await suggestAltText(suggestionInput);
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const imgElement = tempDiv.querySelector<HTMLImageElement>(`img[src="${imageSrc}"]`);
        let proposedFixedContent = content;
        if (imgElement) {
          imgElement.alt = result.suggestedAltText;
          proposedFixedContent = tempDiv.innerHTML;
        }
        setAfterContent(proposedFixedContent);

        toast({
          title: 'Alt Text Suggestion',
          description: (
            <div>
              <p className="mb-2">Suggested: "{result.suggestedAltText}" for image: <span className="font-mono text-xs break-all">{imageSrc}</span></p>
              <p className="text-xs text-muted-foreground mb-3">Preview the change in the 'After' tab below.</p>
              <Button 
                size="sm" 
                className="mt-2 bg-primary/80 hover:bg-primary/90 text-primary-foreground backdrop-blur-sm border border-primary/50"
                onClick={() => {
                  if (imgElement) {
                    onApplySuggestion(proposedFixedContent);
                     toast({ title: 'Success', description: 'Alt text applied to content editor.'});
                     if (showPreviewPanel) setPreviewMode('after');
                  } else {
                     toast({ title: 'Error', description: 'Could not find image in content to apply alt text.', variant: 'destructive'});
                  }
                }}
              >
                Apply to Content
              </Button>
            </div>
          ),
          duration: 15000, 
        });

      } catch (error: any) {
        console.error('Failed to suggest alt text:', error);
        const errorMessage = error.message || 'Could not suggest alt text.';
        toast({
          title: 'Suggestion Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Cannot Suggest Fix',
        description: 'Fix suggestion is not available for this issue type or context is missing.',
        variant: 'destructive',
      });
    }
    setSuggestingFixFor(null);
  };

  const renderPreviewContent = () => {
    if (previewMode === 'before') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    } else {
      return <div dangerouslySetInnerHTML={{ __html: afterContent || content }} />;
    }
  };


  if (isLoading) {
    return (
      <Card className="w-full bg-white/20 dark:bg-slate-800/20 backdrop-blur-lg border border-white/30 dark:border-slate-700/30 rounded-xl shadow-2xl flex flex-col flex-grow">
        <CardHeader className="pb-4">
          <CardTitle className="font-headline text-2xl text-primary dark:text-primary-foreground/90 flex items-center gap-2">
            Accessibility Check
          </CardTitle>
          <CardDescription className="dark:text-slate-400">Analyzing your content, please wait...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center justify-center flex-grow min-h-[300px]">
          <Loader2 className="h-16 w-16 text-primary dark:text-primary-foreground/80 animate-spin" />
          <p className="text-lg text-muted-foreground dark:text-slate-400 animate-pulse">Scanning for issues...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return (
      <Card className="w-full bg-white/20 dark:bg-slate-800/20 backdrop-blur-lg border border-white/30 dark:border-slate-700/30 rounded-xl shadow-2xl flex flex-col flex-grow">
        <CardHeader className="pb-4">
          <CardTitle className="font-headline text-2xl text-primary dark:text-primary-foreground/90 flex items-center gap-2">
            Accessibility Check
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center flex-grow text-center">
          <Info className="h-12 w-12 text-muted-foreground dark:text-slate-500 mb-4" />
          <p className="text-muted-foreground dark:text-slate-400">
            Enter content in the editor and click "Analyze Content" to see accessibility insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { score, issues, suggestions } = analysisResult;
  const scoreData = [{ name: 'score', value: score, fill: getScoreFillColor(score) }];

  return (
    <Card className="w-full bg-white/20 dark:bg-slate-800/20 backdrop-blur-lg border border-white/30 dark:border-slate-700/30 rounded-xl shadow-2xl overflow-hidden flex flex-col flex-grow">
      <CardHeader className="bg-white/10 dark:bg-slate-900/10 backdrop-blur-sm pb-4 border-b border-white/20 dark:border-slate-700/20">
        <CardTitle className="font-headline text-2xl md:text-3xl text-primary dark:text-primary-foreground/90 flex items-center gap-2">
          Accessibility Insights
        </CardTitle>
        <CardDescription className="dark:text-slate-400">A summary of the accessibility status of your content.</CardDescription>
      </CardHeader>
      
      <ScrollArea className="flex-grow">
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-1 font-headline flex items-center justify-center gap-2 dark:text-slate-200">
              {getScoreIcon(score)} Overall Score
            </h3>
            <div className="w-40 h-40 md:w-48 md:h-48 mx-auto my-2">
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
                    background={{ fill: 'hsla(var(--muted-foreground)/0.1)' }}
                    dataKey="value"
                    cornerRadius={7}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl md:text-4xl font-bold fill-primary dark:fill-primary-foreground/90">
                    {score}
                  </text>
                   <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-muted-foreground dark:fill-slate-400">
                    / 100
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-md text-muted-foreground dark:text-slate-400 mt-1">
              {score >= 80 ? "Excellent! Your content is highly accessible." : score >= 50 ? "Good, but some improvements can be made." : "Needs significant improvement for better accessibility."}
            </p>
          </div>

          <Separator className="my-6 border-white/20 dark:border-slate-700/20" />

          <div>
            <h3 className="text-xl font-semibold mb-4 font-headline dark:text-slate-200">Identified Issues ({issues.length})</h3>
            {issues.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {issues.map((issue, index) => {
                  const issueKey = `${issue.type}-${index}`;
                  const isSuggestingCurrentFix = suggestingFixFor === issueKey;
                  return (
                    <AccordionItem value={`item-${index}`} key={index} className="border border-white/30 dark:border-slate-700/40 rounded-lg shadow-sm bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-slate-700/30 transition-colors">
                      <AccordionTrigger className="hover:bg-white/5 dark:hover:bg-slate-700/10 px-3 py-3 rounded-t-lg transition-colors data-[state=open]:bg-white/15 dark:data-[state=open]:bg-slate-700/20">
                        <div className="flex items-center gap-3 text-left w-full">
                          <IssueTypeIcon type={issue.type} className="w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0" />
                          <span className="font-medium text-base text-foreground/90 dark:text-slate-200 flex-grow">{issue.type}</span>
                          {issue.location && <Badge variant="outline" className="ml-auto text-xs hidden sm:inline-block py-1 px-2 border-primary/50 text-primary dark:border-primary/70 dark:text-primary-foreground/80 bg-primary/10 dark:bg-primary/20">{issue.location}</Badge>}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 py-4 bg-white/5 dark:bg-slate-800/10 rounded-b-lg border-t border-white/20 dark:border-slate-700/30">
                        <p className="text-sm text-foreground/80 dark:text-slate-300 mb-2">{issue.message}</p>
                        {issue.elementContext && issue.type.toLowerCase().includes('image') && <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">Image: <span className="font-mono text-xs break-all">{issue.elementContext}</span></p>}
                        {issue.type.toLowerCase().includes('alt text') && issue.elementContext && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 bg-accent/30 dark:bg-accent/20 backdrop-blur-sm border-accent/50 dark:border-accent/40 text-accent-foreground dark:text-accent-foreground/90 hover:bg-accent/40 dark:hover:bg-accent/30 hover:text-accent-foreground hover:shadow-md transition-all duration-150 ease-in-out transform hover:scale-105"
                            onClick={() => handleSuggestFix(issue, index)}
                            disabled={isSuggestingCurrentFix}
                          >
                            {isSuggestingCurrentFix ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Suggest Fix
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <div className="text-center py-6 bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm rounded-md border border-white/20 dark:border-slate-700/30">
                <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400 mx-auto mb-3" />
                <p className="text-muted-foreground dark:text-slate-400">No specific issues found. Fantastic job!</p>
              </div>
            )}
          </div>

          {suggestions.length > 0 && <Separator className="my-6 border-white/20 dark:border-slate-700/20" />}
          
          {suggestions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 font-headline dark:text-slate-200">Suggestions for Improvement</h3>
              <ul className="space-y-3 list-none pl-0">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-foreground/90 dark:text-slate-300 flex items-start gap-2 p-3 bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm rounded-md border border-white/20 dark:border-slate-700/30">
                    <Info className="h-4 w-4 text-primary dark:text-primary-foreground/80 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Separator className="my-6 border-white/20 dark:border-slate-700/20" />

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold font-headline dark:text-slate-200">Content Preview</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreviewPanel(!showPreviewPanel)}
                className="bg-white/20 dark:bg-slate-700/20 backdrop-blur-sm border-slate-400/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-600/30"
              >
                {showPreviewPanel ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showPreviewPanel ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
            {showPreviewPanel && (
              <div className="p-4 bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm rounded-md border border-white/20 dark:border-slate-700/30 space-y-3">
                <div className="flex gap-2 mb-2">
                  <Button
                    size="sm"
                    variant={previewMode === 'before' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('before')}
                    className={`backdrop-blur-sm ${previewMode === 'before' ? 'bg-primary/70 text-primary-foreground border-primary/50' : 'bg-white/20 dark:bg-slate-700/30 border-slate-400/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300'}`}
                  >
                    Before
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'after' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('after')}
                    className={`backdrop-blur-sm ${previewMode === 'after' ? 'bg-primary/70 text-primary-foreground border-primary/50' : 'bg-white/20 dark:bg-slate-700/30 border-slate-400/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300'}`}
                  >
                    After
                  </Button>
                </div>
                <div className="p-3 rounded bg-white dark:bg-slate-900 min-h-[100px] text-sm prose dark:prose-invert max-w-none prose-img:my-1 prose-p:my-1">
                  {renderPreviewContent()}
                </div>
              </div>
            )}
          </div>

        </CardContent>
      </ScrollArea>
    </Card>
  );
};
