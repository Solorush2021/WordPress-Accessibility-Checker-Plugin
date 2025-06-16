
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApiKeyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const DEFAULT_API_KEY = "AIzaSyDkbLl8YoEb7vCyhHEh6k1xeo4wmhvC9Zs";

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onOpenChange }) => {
  const [apiKey, setApiKey] = React.useState('');

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      const storedApiKey = localStorage.getItem('gemini_api_key');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      } else {
        setApiKey(DEFAULT_API_KEY); 
      }
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] liquid-glass-effect bg-gradient-to-br from-[hsl(var(--card)/0.7)] to-[hsl(var(--card)/0.5)] dark:from-[hsl(var(--card)/0.5)] dark:to-[hsl(var(--card)/0.3)] backdrop-blur-xl border-primary/30 rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary">Configure API Key</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your Gemini API key. Your key is stored locally in your browser. The application may also use a globally configured key for backend services.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right text-foreground">
              API Key
            </Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3 bg-background/50 dark:bg-black/20 border-border focus:ring-ring focus:border-ring placeholder:text-muted-foreground text-foreground"
              type="password"
              placeholder="Enter your API key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="liquid-glass-effect bg-background/30 hover:bg-background/50 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-sm border-border text-foreground shadow-md"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSave}
            className="liquid-glass-effect bg-gradient-to-r from-[hsl(var(--primary)/0.4)] to-[hsl(var(--accent)/0.4)] hover:from-[hsl(var(--primary)/0.6)] hover:to-[hsl(var(--accent)/0.6)] text-primary-foreground backdrop-blur-sm border-transparent shadow-lg hover:shadow-primary/40"
          >
            Save Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
