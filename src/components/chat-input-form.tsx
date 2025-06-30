'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizonal, LoaderCircle } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" aria-disabled={pending} disabled={pending}>
      {pending ? <LoaderCircle className="animate-spin" /> : <SendHorizonal />}
      <span className="sr-only">Send</span>
    </Button>
  );
}

type ChatInputFormProps = {
  formAction: (payload: FormData) => void;
  articleContent: string;
  articleLink: string;
};

export function ChatInputForm({ formAction, articleContent, articleLink }: ChatInputFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);


  return (
    <div className="p-4 bg-background">
        <form
        ref={formRef}
        action={(formData) => {
            formAction(formData);
            formRef.current?.reset();
        }}
        className="flex w-full items-center space-x-2"
        >
        <Input
            name="query"
            placeholder="Ask a question about the article..."
            className="flex-1 bg-card"
            autoComplete="off"
            required
        />
        <input type="hidden" name="articleContent" value={articleContent} />
        <input type="hidden" name="articleLink" value={articleLink} />
        <input type="hidden" name="apiKey" value={apiKey} />
        <SubmitButton />
        </form>
    </div>
  );
}
