import type { Message } from '@/components/chat-panel';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, FileText, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function AssistantMessage({ content, source, pending }: Omit<Message, 'role' | 'id'>) {
    if (pending) {
        return (
          <div className="flex items-start space-x-4">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-56" />
            </div>
          </div>
        )
    }

    return (
        <div className="space-y-2">
            <p className="whitespace-pre-wrap">{content}</p>
            {source && (
                <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <FileText className="h-3 w-3" />
                    Source
                </a>
            )}
        </div>
    );
}

export function ChatMessage({ role, ...props }: Message) {
  return (
    <div
      className={cn(
        'flex items-start space-x-4 animate-in fade-in',
        role === 'user' && 'justify-end space-x-reverse'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={role === 'user' ? 'https://placehold.co/32x32/73A5EB/1D2333.png' : 'https://placehold.co/32x32/4A69BD/F2F4F7.png'} />
        <AvatarFallback>
          {role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'max-w-md rounded-lg p-3 text-sm',
          role === 'user'
            ? 'bg-accent text-accent-foreground'
            : 'bg-secondary'
        )}
      >
        {role === 'assistant' ? <AssistantMessage {...props} /> : <p>{props.content}</p>}
      </div>
    </div>
  );
}
