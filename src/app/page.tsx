
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Send, Moon, Sun, Accessibility } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(true);


  const [initialContent, setInitialContent] = useState('');
  useEffect(() => {
    document.documentElement.classList.add('dark');
    setIsDarkMode(true);

    setInitialContent("<h1>My Post Title</h1>\n<p>This is some example content with an image <img src='https://placehold.co/300x200.png' data-ai-hint='abstract placeholder' alt='A placeholder image'> and a <a href='#'>link</a>.</p>\n<p>Another paragraph without proper headings perhaps.</p><h2>Subheading</h2><p>Text under subheading.<img src='https://placehold.co/200x150.png' data-ai-hint='nature landscape' alt='Another placeholder image'></p>");
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

  const handleSettingsClick = (event: React.MouseEvent) => {
    // event.stopPropagation(); // Reverted this line as it might not be the sole cause.
    setIsApiKeyModalOpen(true);
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

  const ribbonAlertText = "SYSTEM ALERT: AI-POWERED ACCESSIBILITY SCAN IN PROGRESS... OPTIMIZING CONTENT FOR UNIVERSAL ACCESS... ALL SYSTEMS NOMINAL...";
  const repeatedRibbonText = `${ribbonAlertText} +++ ${ribbonAlertText} +++ `;


  return (
    <div className={`min-h-screen flex flex-col p-4 md:p-8 selection:bg-primary/30 selection:text-primary-foreground bg-background text-foreground transition-colors duration-300`}>
      <header className="mb-12 flex justify-between items-center"> {/* Increased margin-bottom */}
        <div className="flex-grow min-w-0">
          <h1 className="text-3xl md:text-4xl font-headline neon-orange-red-glow flex items-center gap-3">
            <Accessibility className="h-8 w-8 md:h-10 md:w-10 animate-logo-pulse" />
            Access Assistant
          </h1>
          <div className="feature-ribbon mt-3">
            <div className="font-code ribbon-text-scroll ribbon-text-glow">
              {repeatedRibbonText}
            </div>
          </div>
           <div className="feature-ribbon">
            <div className="font-code ribbon-text-scroll-reverse ribbon-text-glow">
              {repeatedRibbonText}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="liquid-glass-effect bg-card/50 hover:bg-card/70 text-foreground backdrop-blur-sm border-primary/30 shadow-md"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-300" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSettingsClick}
            className="liquid-glass-effect bg-card/50 hover:bg-card/70 text-foreground backdrop-blur-sm border-transparent shadow-md"
            aria-label="Open API Key Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
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
            className="liquid-glass-effect flex-grow min-h-[300px] md:min-h-[500px] p-4 focus:ring-ring focus:border-ring text-foreground text-base"
            aria-label="Post Content Editor"
          />
          <Button
            onClick={handleAnalyzeContent}
            disabled={isLoading}
            size="lg"
            className="w-full md:w-auto md:self-start liquid-glass-effect bg-gradient-to-r from-[hsl(var(--primary)/0.5)] to-[hsl(var(--accent)/0.5)] hover:from-[hsl(var(--primary)/0.7)] hover:to-[hsl(var(--accent)/0.7)] text-primary-foreground transition-all duration-150 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-md"
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

      <footer className="mt-12 text-center text-sm text-muted-foreground/80">
        <p>&copy; {new Date().getFullYear()} Access Assistant. Enhance your content's accessibility.</p>
      </footer>
    </div>
  );
}
