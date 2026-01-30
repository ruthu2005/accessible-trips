import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMember } from '@/integrations';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const location = useLocation();
  const { member, isAuthenticated, isLoading, actions } = useMember();

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-white border-b border-muted-grey/20 sticky top-0 z-50">
      <div className="max-w-[100rem] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-gold flex items-center justify-center">
              <Accessibility className="w-6 h-6 text-accent-gold-foreground" />
            </div>
            <span className="font-heading text-2xl text-foreground">
              ACCESS-TOUR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-paragraph text-base transition-colors ${
                isActive('/') ? 'text-accent-gold' : 'text-foreground hover:text-accent-gold'
              }`}
            >
              Home
            </Link>
            <Link
              to="/tours"
              className={`font-paragraph text-base transition-colors ${
                isActive('/tours') ? 'text-accent-gold' : 'text-foreground hover:text-accent-gold'
              }`}
            >
              Tours
            </Link>
            <Link
              to="/feedback"
              className={`font-paragraph text-base transition-colors ${
                isActive('/feedback') ? 'text-accent-gold' : 'text-foreground hover:text-accent-gold'
              }`}
            >
              Feedback
            </Link>
            {isAuthenticated && member?.loginEmail === 'admin@accesstour.com' && (
              <Link
                to="/admin"
                className={`font-paragraph text-base transition-colors ${
                  isActive('/admin') ? 'text-accent-gold' : 'text-foreground hover:text-accent-gold'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleHighContrast}
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground rounded-md"
              aria-label="Toggle high contrast mode"
            >
              <Accessibility className="h-5 w-5" />
            </Button>
            
            {isLoading ? null : isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-paragraph text-base px-6 py-5 rounded-md h-auto">
                    {member?.profile?.nickname || 'Profile'}
                  </Button>
                </Link>
                <Button
                  onClick={actions.logout}
                  className="bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base px-6 py-5 rounded-md h-auto"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={actions.login}
                className="bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base px-6 py-5 rounded-md h-auto"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 flex flex-col gap-4">
            <Link
              to="/"
              className={`font-paragraph text-base transition-colors ${
                isActive('/') ? 'text-accent-gold' : 'text-foreground hover:text-accent-gold'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/tours"
              className={`font-paragraph text-base transition-colors ${
                isActive('/tours') ? 'text-accent-gold' : 'text-foreground hover:text-accent-gold'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tours
            </Link>
            <Link
              to="/feedback"
              className={`font-paragraph text-base transition-colors ${
                isActive('/feedback') ? 'text-accent-gold' : 'text-foreground hover:text-accent-gold'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Feedback
            </Link>
            {isAuthenticated && member?.loginEmail === 'admin@accesstour.com' && (
              <Link
                to="/admin"
                className={`font-paragraph text-base transition-colors ${
                  isActive('/admin') ? 'text-accent-gold' : 'text-foreground hover:text-accent-gold'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="flex flex-col gap-3 mt-4">
              <Button
                variant="outline"
                onClick={toggleHighContrast}
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-paragraph text-base px-6 py-5 rounded-md h-auto justify-start"
              >
                <Accessibility className="h-5 w-5 mr-2" />
                High Contrast
              </Button>
              
              {isLoading ? null : isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-paragraph text-base px-6 py-5 rounded-md h-auto">
                      {member?.profile?.nickname || 'Profile'}
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      actions.logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base px-6 py-5 rounded-md h-auto"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    actions.login();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground font-paragraph text-base px-6 py-5 rounded-md h-auto"
                >
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
