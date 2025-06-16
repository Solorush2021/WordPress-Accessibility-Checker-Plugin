
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
import { Sparkles, CheckCircle, AlertTriangle, Info, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
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
  if (value < 50) return <AlertTriangle className="h-6 w-6 text-[hsl(var(--score-low))]" />;
  if (value < 80) return <Info className="h-6 w-6 text-[hsl(var(--score-medium))]" />;
  return <CheckCircle className="h-6 w-6 text-[hsl(var(--score-high))]" />;
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
              <p className="text-xs text-muted-foreground mb-3">Preview the change in the 'After' tab. Click 'Apply' to update editor.</p>
              <Button
                size="sm"
                className="mt-2 liquid-glass-effect bg-gradient-to-r from-[hsl(var(--primary)/0.4)] to-[hsl(var(--accent)/0.4)] hover:from-[hsl(var(--primary)/0.6)] hover:to-[hsl(var(--accent)/0.6)] text-primary-foreground backdrop-blur-sm border-transparent shadow-lg hover:shadow-primary/40"
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
    const currentDisplayContent = previewMode === 'before' ? content : (afterContent || content);
    return <div className="prose max-w-none prose-sm text-foreground" dangerouslySetInnerHTML={{ __html: currentDisplayContent }} />;
  };


  if (isLoading) {
    return (
      <Card className="w-full liquid-glass-effect flex flex-col flex-grow">
        <CardHeader className="pb-4">
          <CardTitle className="font-headline text-2xl text-[hsl(var(--primary))] flex items-center gap-2">
            Accessibility Check
          </CardTitle>
          <CardDescription className="text-muted-foreground">Analyzing your content, please wait...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center justify-center flex-grow min-h-[300px]">
          <Loader2 className="h-16 w-16 text-[hsl(var(--primary))] animate-spin" />
          <p className="text-lg text-muted-foreground animate-pulse">Scanning for issues...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return (
      <Card className="w-full liquid-glass-effect flex flex-col flex-grow">
        <CardHeader className="pb-4">
          <CardTitle className="font-headline text-2xl text-[hsl(var(--primary))] flex items-center gap-2">
            Accessibility Check
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center flex-grow text-center">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Enter content in the editor and click "Analyze Content" to see accessibility insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { score, issues, suggestions } = analysisResult;
  const scoreData = [{ name: 'score', value: score, fill: getScoreFillColor(score) }];

  return (
    <Card className="w-full liquid-glass-effect overflow-hidden flex flex-col flex-grow">
      <CardHeader className="bg-black/20 backdrop-blur-sm pb-4 border-b border-[hsla(var(--primary-foreground),0.08)]">
        <CardTitle className="font-headline text-2xl md:text-3xl text-[hsl(var(--primary))] flex items-center gap-2">
          Accessibility Insights
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">A summary of your content's accessibility status.</CardDescription>
      </CardHeader>

      <ScrollArea className="flex-grow">
        <CardContent className="p-4 md:p-6 space-y-8">

          <div className="text-center p-4 bg-black/20 backdrop-blur-md rounded-xl border border-[hsla(var(--primary-foreground),0.08)] shadow-lg">
            <h3 className="text-xl font-semibold mb-2 font-headline flex items-center justify-center gap-2 text-foreground">
              {getScoreIcon(score)} Overall Score
            </h3>
            <div className="w-40 h-40 md:w-48 md:h-48 mx-auto my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  barSize={16}
                  data={scoreData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar
                    background={{ fill: 'hsla(var(--muted-foreground),0.15)' }}
                    dataKey="value"
                    cornerRadius={8}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl md:text-4xl font-bold fill-[hsl(var(--primary))]">
                    {score}
                  </text>
                   <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-muted-foreground">
                    / 100
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-md text-muted-foreground/90 mt-1">
              {score >= 80 ? "Excellent! Your content is highly accessible." : score >= 50 ? "Good, but some improvements can be made." : "Needs significant improvement for better accessibility."}
            </p>
          </div>

          <Separator className="my-6 border-[hsla(var(--primary-foreground),0.08)]" />

          <div>
            <h3 className="text-xl font-semibold mb-4 font-headline text-foreground">Identified Issues ({issues.length})</h3>
            {issues.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {issues.map((issue, index) => {
                  const issueKey = `${issue.type}-${index}`;
                  const isSuggestingCurrentFix = suggestingFixFor === issueKey;
                  return (
                    <AccordionItem value={`item-${index}`} key={index} className="bg-black/20 backdrop-blur-md border border-[hsla(var(--border),0.3)] rounded-lg shadow-md overflow-hidden">
                      <AccordionTrigger className="hover:bg-black/20 px-4 py-3 rounded-t-lg transition-colors data-[state=open]:bg-black/30">
                        <div className="flex items-center gap-3 text-left w-full">
                          <IssueTypeIcon type={issue.type} className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <span className="font-medium text-base text-foreground flex-grow">{issue.type}</span>
                          {issue.location && <Badge variant="outline" className="ml-auto text-xs hidden sm:inline-block py-1 px-2 border-primary/50 text-primary bg-primary/10">{issue.location}</Badge>}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-4 bg-black/10 rounded-b-lg border-t border-[hsla(var(--primary-foreground),0.08)]">
                        <p className="text-sm text-foreground/80 mb-3">{issue.message}</p>
                        {issue.elementContext && issue.type.toLowerCase().includes('image') && <p className="text-xs text-muted-foreground mt-1 mb-3">Image: <span className="font-mono text-xs break-all p-1 bg-muted/30 rounded">{issue.elementContext}</span></p>}
                        {issue.type.toLowerCase().includes('alt text') && issue.elementContext && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 liquid-glass-effect bg-gradient-to-r from-[hsl(var(--accent)/0.4)] to-[hsl(var(--primary)/0.3)] hover:from-[hsl(var(--accent)/0.6)] hover:to-[hsl(var(--primary)/0.4)] backdrop-blur-sm border-transparent text-accent-foreground hover:shadow-accent/30 shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105"
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
              <div className="text-center py-8 bg-black/20 backdrop-blur-md border border-[hsla(var(--border),0.3)] rounded-lg shadow-md">
                <CheckCircle className="h-12 w-12 text-[hsl(var(--score-high))] mx-auto mb-3" />
                <p className="text-muted-foreground text-lg">No specific issues found. Fantastic job!</p>
              </div>
            )}
          </div>

          {suggestions.length > 0 && <Separator className="my-8 border-[hsla(var(--primary-foreground),0.08)]" />}

          {suggestions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 font-headline text-foreground">Suggestions for Improvement</h3>
              <ul className="space-y-3 list-none pl-0">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-foreground/90 flex items-start gap-3 p-3 bg-black/20 backdrop-blur-md border border-[hsla(var(--border),0.3)] rounded-lg shadow-sm">
                    <Info className="h-5 w-5 text-[hsl(var(--primary))] mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator className="my-8 border-[hsla(var(--primary-foreground),0.08)]" />

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold font-headline text-foreground">Content Preview</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreviewPanel(!showPreviewPanel)}
                className="liquid-glass-effect bg-card/30 hover:bg-card/50 backdrop-blur-md border-transparent text-foreground shadow-md hover:shadow-lg transition-all"
              >
                {showPreviewPanel ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                {showPreviewPanel ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
            {showPreviewPanel && (
              <div className="p-4 bg-black/20 backdrop-blur-lg border border-[hsla(var(--border),0.3)] rounded-xl space-y-4 shadow-lg">
                <div className="flex gap-2 mb-3">
                  <Button
                    size="sm"
                    variant={previewMode === 'before' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('before')}
                    className={`liquid-glass-effect backdrop-blur-sm shadow-md hover:shadow-lg transition-all ${previewMode === 'before' ? 'bg-gradient-to-r from-[hsl(var(--primary)/0.5)] to-[hsl(var(--accent)/0.5)] hover:from-[hsl(var(--primary)/0.7)] hover:to-[hsl(var(--accent)/0.7)] text-primary-foreground border-transparent' : 'bg-black/30 hover:bg-black/40 border-transparent text-foreground'}`}
                  >
                    Before
                  </Button>
                  <Button
                    size="sm"
                    variant={previewMode === 'after' ? 'default' : 'outline'}
                    onClick={() => setPreviewMode('after')}
                     className={`liquid-glass-effect backdrop-blur-sm shadow-md hover:shadow-lg transition-all ${previewMode === 'after' ? 'bg-gradient-to-r from-[hsl(var(--primary)/0.5)] to-[hsl(var(--accent)/0.5)] hover:from-[hsl(var(--primary)/0.7)] hover:to-[hsl(var(--accent)/0.7)] text-primary-foreground border-transparent' : 'bg-black/30 hover:bg-black/40 border-transparent text-foreground'}`}
                  >
                    After
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-background/80 min-h-[150px] shadow-inner">
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
