import { Bell, User, LogOut, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 bg-white border-b-3 border-ink shadow-card">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Page title will be rendered by pages */}
        <div className="flex-1" />
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            className="btn btn-ghost btn-sm p-2"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {/* Notifications */}
          <div className="relative">
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
              <div className="absolute right-0 mt-2 w-72 bg-white border-3 border-ink shadow-hero rounded-[12px] p-4 animate-slide-up">
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
                <button className="btn btn-ghost btn-sm w-full mt-3">View all</button>
              </div>
            )}
          </div>
          
          {/* User menu */}
          <div className="relative">
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
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border-3 border-ink shadow-hero rounded-[12px] p-2 animate-slide-up">
                <button className="w-full btn btn-ghost btn-sm justify-start px-3 py-2">
                  <User className="w-4 h-4 mr-2" aria-hidden="true" />
                  Profile
                </button>
                <button className="w-full btn btn-ghost btn-sm justify-start px-3 py-2 text-rose">
                  <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}