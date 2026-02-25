import { useNavigate } from '@tanstack/react-router';
import { useGetAllEntries } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Mountain } from 'lucide-react';
import { getAuthorLabel, formatTimestamp, stripPlaceNames } from '../lib/guestbookFormat';

export default function GuestbookFeedPage() {
  const navigate = useNavigate();
  const { data: entries, isLoading } = useGetAllEntries();

  if (isLoading) {
    return (
      <div className="pb-20 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Guest Book</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const sortedEntries = [...(entries || [])].sort((a, b) => 
    Number(b.timestamp - a.timestamp)
  );

  return (
    <div className="pb-20 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Guest Book</h2>
        <Badge variant="secondary">
          {sortedEntries.length} {sortedEntries.length === 1 ? 'entry' : 'entries'}
        </Badge>
      </div>

      {sortedEntries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No entries yet. Be the first to sign the guest book!
            </p>
            <Button onClick={() => navigate({ to: '/add' })}>
              Sign the Guest Book
            </Button>
          </CardContent>
        </Card>
      ) : (
        sortedEntries.map((entry, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate({ to: '/entry/$entryId', params: { entryId: String(index) } })}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">
                    {getAuthorLabel(entry)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatTimestamp(entry.timestamp)}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {entry.currentLocation && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      World
                    </Badge>
                  )}
                  {entry.favoritePlace && (
                    <Badge variant="secondary" className="text-xs">
                      <Mountain className="h-3 w-3 mr-1" />
                      AT
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3 whitespace-pre-wrap">
                {stripPlaceNames(entry.comment)}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
