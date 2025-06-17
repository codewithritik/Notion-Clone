import React from 'react';
import { useEditor } from '@tiptap/react';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Link } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

interface LinkSuggestion {
  linkText: string;
  pageId: string;
  context: string;
}

interface LinkSuggestionsProps {
  suggestions: LinkSuggestion[];
  onSelect: (suggestion: LinkSuggestion) => void;
  onClose: () => void;
}

export function LinkSuggestions({ suggestions, onSelect, onClose }: LinkSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <Popover open={suggestions.length > 0} onOpenChange={onClose}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2"
        >
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <ScrollArea className="h-[300px]">
          <div className="p-4">
            <h4 className="mb-2 font-medium">Suggested Links</h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-3 hover:bg-accent cursor-pointer"
                  onClick={() => onSelect(suggestion)}
                >
                  <div className="font-medium text-primary">
                    {suggestion.linkText}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.context}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
} 