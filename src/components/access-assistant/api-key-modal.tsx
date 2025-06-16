
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
    localStorage.setItem('gemini_api_key', apiKey);
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
      <DialogContent className="sm:max-w-[425px] liquid-glass-effect bg-[linear-gradient(140deg,hsl(var(--primary)/0.1),hsl(var(--accent)/0.1),hsl(var(--background)/0.5))] backdrop-blur-xl border-transparent rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-[hsl(var(--primary))]">Configure API Key</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your Gemini API key to enable accessibility analysis. Your key is stored locally in your browser.
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
              className="col-span-3 bg-black/20 border-border focus:ring-ring focus:border-ring placeholder:text-muted-foreground text-foreground"
              type="password"
              placeholder="Enter your API key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="liquid-glass-effect bg-black/20 hover:bg-black/30 backdrop-blur-sm border-transparent text-foreground shadow-md"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSave}
            className="liquid-glass-effect bg-[linear-gradient(120deg,hsl(var(--primary)/0.4),hsl(var(--accent)/0.4),hsl(var(--primary)/0.4))] hover:bg-[linear-gradient(120deg,hsl(var(--primary)/0.6),hsl(var(--accent)/0.6),hsl(var(--primary)/0.6))] text-primary-foreground backdrop-blur-sm border-transparent shadow-lg hover:shadow-primary/40"
          >
            Save Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
