import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';

export default function BrandHeader() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/assets/generated/mogambo-logo.dim_512x192.png"
            alt="Mogambo"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, <span className="text-foreground font-medium">{userProfile.name}</span>
            </span>
          )}
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/admin' })}
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          )}
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
