import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search } from 'lucide-react';
import { searchPlaces, type GeocodingResult } from '../lib/geocoding';

interface PlaceSearchFieldProps {
  label: string;
  placeholder: string;
  onSelect: (result: GeocodingResult) => void;
}

export default function PlaceSearchField({ label, placeholder, onSelect }: PlaceSearchFieldProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a place name');
      return;
    }

    setIsSearching(true);
    setError('');
    setResults([]);

    try {
      const searchResults = await searchPlaces(query);
      setResults(searchResults);
      
      // If only one result, auto-select it
      if (searchResults.length === 1) {
        handleSelect(searchResults[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search for location');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (result: GeocodingResult) => {
    onSelect(result);
    setResults([]);
    setQuery('');
    setError('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`place-search-${label}`} className="text-sm">{label}</Label>
      <div className="flex gap-2">
        <Input
          id={`place-search-${label}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="default"
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search results selection */}
      {results.length > 1 && (
        <div className="space-y-2">
          <Label className="text-sm">Select a location</Label>
          <Select onValueChange={(value) => {
            const result = results[parseInt(value)];
            if (result) handleSelect(result);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose from results..." />
            </SelectTrigger>
            <SelectContent>
              {results.map((result, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {result.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
