"use client";

import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AIResponse, loadArticle, submitQuery } from '@/app/actions';
import { ChatMessages } from '@/components/chat-messages';
import { ChatInputForm } from '@/components/chat-input-form';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  pending?: boolean;
};

type Article = {
    title: string;
    content: string;
    url: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [url, setUrl] = useState('');
  const { toast } = useToast();
  
  const handleLoadArticle = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!url.trim()) {
          toast({ variant: 'destructive', title: 'Error', description: 'Please enter a URL.' });
          return;
      }
      setIsLoadingArticle(true);
      setMessages([]);

      const apiKey = localStorage.getItem('gemini_api_key') || undefined;
      const result = await loadArticle(url, apiKey);
      
      if (result.success && result.title && result.content && result.url && result.summary) {
          setArticle({ title: result.title, content: result.content, url: result.url });
          setMessages([
              {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: `Successfully loaded article: "${result.title}".\n\nHere's a quick summary:\n${result.summary}\n\nNow, ask me anything about the article!`
              }
          ]);
      } else {
          toast({ variant: 'destructive', title: 'Error loading article', description: result.error });
      }
      setIsLoadingArticle(false);
  }
  
  const handleQuerySubmit = async (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query.trim()) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: query };
    const pendingMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', pending: true };

    setMessages(prev => [...prev, userMessage, pendingMessage]);

    try {
      const response: AIResponse = await submitQuery(null, formData);

      setMessages(prev => prev.map(m => 
        m.id === pendingMessage.id ? { ...m, ...response, id: pendingMessage.id, pending: false } : m
      ));
      
      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
      }
    } catch (error) {
       setMessages(prev => prev.filter(m => m.id !== pendingMessage.id));
       toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
        });
    }
  };


  if (!article) {
      return (
          <Card className="flex flex-col h-full m-2 rounded-xl shadow-lg">
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <h2 className="text-2xl font-semibold mb-2">Welcome to WikiMind</h2>
                  <p className="text-muted-foreground mb-6">Enter a Wikipedia article URL to get started.</p>
                  <form onSubmit={handleLoadArticle} className="w-full max-w-md flex items-center space-x-2">
                      <Input 
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://en.wikipedia.org/wiki/Your_Article"
                          required
                          disabled={isLoadingArticle}
                          className="bg-card"
                      />
                      <Button type="submit" disabled={isLoadingArticle}>
                          {isLoadingArticle ? <LoaderCircle className="animate-spin" /> : 'Load'}
                      </Button>
                  </form>
              </div>
          </Card>
      );
  }

  return (
    <Card className="flex flex-col h-full m-2 rounded-xl shadow-lg">
      <ChatMessages messages={messages} />
      <div className="mt-auto border-t">
        <ChatInputForm 
          formAction={handleQuerySubmit} 
          articleContent={article.content} 
          articleLink={article.url}
        />
      </div>
    </Card>
  );
}
