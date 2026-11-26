import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Bell, User, LogOut, Moon, Sun, ChevronDown, Search, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b-3 border-ink shadow-card">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Search & Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search residents, flats, notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Global search"
            />
          </div>

          {title && (
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold font-heading text-ink">{title}</h1>
              {subtitle && <p className="text-sm font-body text-ink/60">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {actions}

          {/* Global Search (mobile) */}
          <div className="md:hidden">
            <button
              className="btn btn-ghost btn-sm p-2"
              onClick={() => { /* TODO: open search modal */ }}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Theme toggle */}
          <button
            className="btn btn-ghost btn-sm p-2"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="btn btn-ghost btn-sm p-2 relative"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-tomato text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border-3 border-ink shadow-hero rounded-[12px] p-4 animate-slide-up">
                <div className="font-bold font-heading mb-3">Notifications</div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="p-3 bg-sky/10 border-2 border-sky rounded-[8px]">
                    <div className="font-medium text-sm">New visitor at Flat 101</div>
                    <div className="text-xs text-ink/60 mt-1">2 minutes ago</div>
                  </div>
                  <div className="p-3 bg-butter/10 border-2 border-butter rounded-[8px]">
                    <div className="font-medium text-sm">Complaint #123 updated</div>
                    <div className="text-xs text-ink/60 mt-1">15 minutes ago</div>
                  </div>
                  <div className="p-3 bg-mint/10 border-2 border-mint rounded-[8px]">
                    <div className="font-medium text-sm">Payment received from Flat 205</div>
                    <div className="text-xs text-ink/60 mt-1">1 hour ago</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">View all</Button>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="btn btn-ghost btn-sm flex items-center gap-2"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="w-8 h-8 rounded-[999px] bg-mint border-3 border-ink flex items-center justify-center">
                <User className="w-4 h-4 text-ink" aria-hidden="true" />
              </div>
              <span className="hidden sm:block font-medium">Admin</span>
              <ChevronDown className="w-4 h-4 hidden sm:block" aria-hidden="true" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border-3 border-ink shadow-hero rounded-[12px] p-2 animate-slide-up">
                <Button variant="ghost" size="sm" className="w-full justify-start px-3 py-2" onClick={() => setShowUserMenu(false)}>
                  <User className="w-4 h-4 mr-2" aria-hidden="true" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start px-3 py-2 text-rose" onClick={() => setShowUserMenu(false)}>
                  <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}