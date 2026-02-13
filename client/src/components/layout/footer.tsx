import { Link } from "wouter";
import { Grid3X3 } from "lucide-react";
import { useTranslation } from "react-i18next";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.186 24h-.007C5.965 24 2.634 20.199 2.634 14.68V14.2c.096-4.266 2.145-7.384 5.596-8.53a9.93 9.93 0 013.957-.663c2.66.132 4.752 1.158 6.22 3.05l-2.2 2.126c-1.04-1.282-2.544-1.972-4.232-1.972h-.01c-1.388.007-2.555.473-3.374 1.347-.84.897-1.29 2.185-1.34 3.834v.48c.05 1.65.5 2.937 1.34 3.834.82.874 1.986 1.34 3.374 1.347h.01c1.436-.007 2.525-.4 3.237-1.168.584-.63.96-1.503 1.118-2.594h-4.355v-2.63h7.18c.088.476.132.96.132 1.447 0 2.86-.846 5.1-2.448 6.478C15.451 23.327 13.544 24 12.186 24z" />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.502 6.204 3.254-3.724.497-7.028 2.474-3.89 6.882C6.318 24 9.457 18.682 12 18.682c2.543 0 5.682 5.318 9.062 1.701 3.138-4.408-.166-6.385-3.89-6.882 2.604.248 5.42-.627 6.204-3.254.246-.828.624-5.789.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-card py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Branding column */}
          <div className="md:min-w-[200px]">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <Grid3X3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-semibold">{t('common.appName')}</span>
            </Link>
            <p className="text-xs text-muted-foreground mb-4">Your home for quilting patterns, projects, and community.</p>
            <p className="text-xs text-muted-foreground">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
          <div>
            <h3 className="font-serif font-semibold text-sm mb-2">Discover</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/patterns" className="hover:text-foreground transition-colors">Patterns</Link></li>
              <li><Link href="/blocks" className="hover:text-foreground transition-colors">Blocks</Link></li>
              <li><Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-serif font-semibold text-sm mb-2">Community</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/community/forums" className="hover:text-foreground transition-colors">Forums</Link></li>
              <li><Link href="/community/groups" className="hover:text-foreground transition-colors">Groups</Link></li>
              <li><Link href="/community/events" className="hover:text-foreground transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-serif font-semibold text-sm mb-2">Support</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/getting-started" className="hover:text-foreground transition-colors">Getting Started</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-serif font-semibold text-sm mb-2">Socials</h3>
            <div className="grid grid-cols-3 gap-3 w-fit">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Pinterest">
                <PinterestIcon className="h-6 w-6" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-6 w-6" />
              </a>
              <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Threads">
                <ThreadsIcon className="h-6 w-6" />
              </a>
              <a href="https://bsky.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Bluesky">
                <BlueskyIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
