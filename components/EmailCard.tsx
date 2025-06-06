"use client";

import { Email, Label } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, Clock, User, Tag } from 'lucide-react';
import { formatRelativeTime } from '@/lib/temporal-utils';

interface EmailCardProps {
  email: Email;
  labels: Label[];
  onArchive?: (id: string) => void;
  className?: string;
}

export function EmailCard({ email, labels, onArchive, className }: EmailCardProps) {
  const emailLabels = labels.filter(label => email.labels.includes(label.id));

  return (
    <Card className={`transition-all hover:shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-5 truncate">
              {email.subject}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{email.sender}</span>
            </div>
          </div>
          {onArchive && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => onArchive(email.id)}
            >
              <Archive className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {email.summary}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {formatRelativeTime(email.date, 'es')}
            </span>
          </div>
          
          {emailLabels.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <div className="flex gap-1">
                {emailLabels.slice(0, 3).map(label => (
                  <span
                    key={label.id}
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: label.color }}
                    title={label.name}
                  />
                ))}
                {emailLabels.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{emailLabels.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 