"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeAccessibility, type AnalyzeAccessibilityOutput } from '@/ai/flows/analyze-accessibility';
import { AccessibilityMetaBox } from '@/components/access-assistant/accessibility-meta-box';
import { ApiKeyModal } from '@/components/access-assistant/api-key-modal';

export default function AccessAssistantPage() {
  const [content, setContent] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeAccessibilityOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const { toast } = useToast();

  // Avoid hydration mismatch for initial content if it were dynamic
  const [initialContent, setInitialContent] = useState('');
  useEffect(() => {
    setInitialContent("<h1>My Post Title</h1>\n<p>This is some example content with an image <img src='https://placehold.co/300x200.png' data-ai-hint='abstract placeholder' alt='Placeholder image'> and a <a href='#'>link</a>.</p>\n<p>Another paragraph without proper headings perhaps.</p><h2>Subheading</h2><p>Text under subheading.</p>");
  }, []);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);


  const handleAnalyzeContent = async () => {
    if (!content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please enter some content to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null); 
    try {
      const result = await analyzeAccessibility({ content });
      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete',
        description: 'Accessibility report generated successfully.',
      });
    } catch (error) {
      console.error('Accessibility analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'An error occurred while analyzing content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 selection:bg-primary/20 selection:text-primary">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-headline text-primary">Access Assistant</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsApiKeyModalOpen(true)}
          className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
          aria-label="Open API Key Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 flex flex-col space-y-4">
          <label htmlFor="postContent" className="text-lg font-semibold font-headline text-foreground/90">
            Post Content Editor
          </label>
          <Textarea
            id="postContent"
            placeholder="Start writing or paste your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow min-h-[300px] md:min-h-[500px] p-4 rounded-lg shadow-inner bg-white dark:bg-gray-800 focus:ring-accent focus:border-accent text-base"
            aria-label="Post Content Editor"
          />
          <Button
            onClick={handleAnalyzeContent}
            disabled={isLoading}
            size="lg"
            className="w-full md:w-auto md:self-start bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-150 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Analyze Content
              </>
            )}
          </Button>
        </div>

        <div className="md:col-span-1 flex flex-col">
          <AccessibilityMetaBox analysisResult={analysisResult} isLoading={isLoading} />
        </div>
      </main>

      <ApiKeyModal isOpen={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen} />
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Access Assistant. Enhance your content's accessibility.</p>
      </footer>
    </div>
  );
}
