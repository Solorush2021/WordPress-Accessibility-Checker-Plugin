
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

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onOpenChange }) => {
  const [apiKey, setApiKey] = React.useState('');

  const handleSave = () => {
    console.log('Simulated API Key Save:', apiKey);
    localStorage.setItem('gemini_api_key', apiKey); // Basic save, not secure for real apps
    onOpenChange(false);
  };

  React.useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/10 dark:bg-slate-800/30 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary dark:text-primary">Configure API Key</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Enter your Gemini API key to enable accessibility analysis. Your key is stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right text-slate-700 dark:text-slate-300">
              API Key
            </Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3 bg-white/50 dark:bg-slate-700/60 border-slate-300 dark:border-slate-600/70 focus:ring-accent focus:border-accent placeholder:text-slate-400 dark:placeholder:text-slate-500"
              type="password"
              placeholder="Enter your API key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-white/40 dark:bg-slate-700/60 backdrop-blur-sm border-slate-400/70 dark:border-slate-600/70 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-600/70 shadow-md"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSave} 
            className="bg-primary/80 hover:bg-primary text-primary-foreground backdrop-blur-sm border border-primary/50 shadow-lg hover:shadow-primary/40"
          >
            Save Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
