import { Link } from 'react-router-dom';
import { Accessibility, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-secondary text-secondary-foreground">
      <div className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent-gold flex items-center justify-center">
                <Accessibility className="w-6 h-6 text-accent-gold-foreground" />
              </div>
              <span className="font-heading text-2xl text-secondary-foreground">
                ACCESS-TOUR
              </span>
            </Link>
            <p className="font-paragraph text-base text-secondary-foreground/80 leading-relaxed">
              Curating accessible travel experiences for elderly and differently-abled explorers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl text-secondary-foreground mb-6">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
              >
                Home
              </Link>
              <Link
                to="/tours"
                className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
              >
                Browse Tours
              </Link>
              <Link
                to="/feedback"
                className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
              >
                Share Feedback
              </Link>
              <a
                href="#features"
                className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
              >
                Features
              </a>
            </nav>
          </div>

          {/* Accessibility */}
          <div>
            <h3 className="font-heading text-xl text-secondary-foreground mb-6">
              Accessibility
            </h3>
            <nav className="flex flex-col gap-3">
              <a
                href="#accessibility-statement"
                className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
              >
                Accessibility Statement
              </a>
              <a
                href="#wcag-compliance"
                className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
              >
                WCAG Compliance
              </a>
              <a
                href="#keyboard-navigation"
                className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
              >
                Keyboard Navigation Guide
              </a>
              <a
                href="#screen-reader"
                className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
              >
                Screen Reader Support
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-xl text-secondary-foreground mb-6">
              Contact Us
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent-gold mt-1 flex-shrink-0" />
                <a
                  href="mailto:info@accesstour.com"
                  className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
                >
                  info@accesstour.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent-gold mt-1 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="font-paragraph text-base text-secondary-foreground/80 hover:text-accent-gold transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-gold mt-1 flex-shrink-0" />
                <span className="font-paragraph text-base text-secondary-foreground/80">
                  123 Accessible Way, Travel City, TC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-secondary-foreground/70 text-center md:text-left">
              © {new Date().getFullYear()} ACCESS-TOUR. All rights reserved. Committed to accessible travel for everyone.
            </p>
            <div className="flex gap-6">
              <a
                href="#privacy"
                className="font-paragraph text-sm text-secondary-foreground/70 hover:text-accent-gold transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="font-paragraph text-sm text-secondary-foreground/70 hover:text-accent-gold transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
