import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import JobResultsList from '../components/JobResultsList';
import { useSearchJobs } from '../hooks/useQueries';
import AdSlot from '../components/ads/AdSlot';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [searchParams, setSearchParams] = useState<{ keyword: string; location: string } | null>(null);

  const { data: jobs = [], isLoading, error } = useSearchJobs(
    searchParams?.keyword || '',
    searchParams?.location || '',
    searchParams ? null : null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      setSearchParams({ keyword: keyword.trim(), location: location.trim() });
    }
  };

  return (
    <div className="relative">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/generated/mogambo-hero-bg.dim_1600x900.png)' }}
        />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Find Your Dream Job
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search thousands of jobs from multiple portals in one place
            </p>

            {/* Top Ad Slot */}
            <AdSlot slot="top-banner" className="mb-8" />

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              <div className="grid md:grid-cols-[1fr,auto,1fr,auto] gap-4 items-end">
                <div className="space-y-2">
                  <label htmlFor="keyword" className="text-sm font-medium text-left block">
                    Job Title or Keywords
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="keyword"
                      placeholder="e.g. Software Engineer"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="hidden md:block h-10 w-px bg-border" />

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium text-left block">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g. Remote, New York"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="md:w-auto w-full">
                  Search Jobs
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {searchParams && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {jobs.length > 0 ? `${jobs.length} Jobs Found` : 'No Jobs Found'}
                </h2>
                <p className="text-muted-foreground">
                  Showing results for "{searchParams.keyword}"
                  {searchParams.location && ` in ${searchParams.location}`}
                </p>
              </div>

              {/* In-Results Ad Slot */}
              <AdSlot slot="in-results" className="mb-6" />

              <JobResultsList jobs={jobs} isLoading={isLoading} error={error} />
            </>
          )}

          {!searchParams && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Enter a job title or keywords to start searching
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
