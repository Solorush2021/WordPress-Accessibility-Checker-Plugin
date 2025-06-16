
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Send, Moon, Sun } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode


  const [initialContent, setInitialContent] = useState('');
  useEffect(() => {
    setInitialContent("<h1>My Post Title</h1>\n<p>This is some example content with an image <img src='https://placehold.co/300x200.png' data-ai-hint='abstract placeholder' alt=''> and a <a href='#'>link</a>.</p>\n<p>Another paragraph without proper headings perhaps.</p><h2>Subheading</h2><p>Text under subheading.<img src='https://placehold.co/200x150.png' data-ai-hint='nature landscape'></p>");
  }, []);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };


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
    } catch (error: any) {
      console.error('Accessibility analysis failed:', error);
      const errorMessage = error.message || 'An error occurred while analyzing content. Please try again.';
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col p-4 md:p-8 selection:bg-primary/20 selection:text-primary transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-black' : 'bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200'}`}>
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-headline text-primary dark:text-primary">Access Assistant</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm border-primary/50 text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 shadow-md"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsApiKeyModalOpen(true)}
            className="bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm border-primary/50 text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 shadow-md"
            aria-label="Open API Key Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 flex flex-col space-y-4">
          <label htmlFor="postContent" className="text-lg font-semibold font-headline text-foreground/90 dark:text-foreground/80">
            Post Content Editor
          </label>
          <Textarea
            id="postContent"
            placeholder="Start writing or paste your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow min-h-[300px] md:min-h-[500px] p-4 rounded-lg shadow-inner bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm focus:ring-accent focus:border-accent text-base border-slate-300 dark:border-slate-700/60"
            aria-label="Post Content Editor"
          />
          <Button
            onClick={handleAnalyzeContent}
            disabled={isLoading}
            size="lg"
            className="w-full md:w-auto md:self-start bg-accent hover:bg-accent/80 text-accent-foreground transition-all duration-150 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-md bg-opacity-80 dark:bg-opacity-70 border border-accent/50"
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
          <AccessibilityMetaBox 
            analysisResult={analysisResult} 
            isLoading={isLoading} 
            content={content} 
            onApplySuggestion={(newContent: string) => {
              setContent(newContent);
            }}
          />
        </div>
      </main>

      <ApiKeyModal isOpen={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen} />
      
      <footer className="mt-12 text-center text-sm text-muted-foreground/80 dark:text-muted-foreground/70">
        <p>&copy; {new Date().getFullYear()} Access Assistant. Enhance your content's accessibility.</p>
      </footer>
    </div>
  );
}
