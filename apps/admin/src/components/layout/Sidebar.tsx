import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCheck, 
  Ticket, 
  Megaphone, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/societies', label: 'Societies', icon: Building2 },
  { path: '/residents', label: 'Residents', icon: Users },
  { path: '/visitors', label: 'Visitors', icon: UserCheck },
  { path: '/tickets', label: 'Tickets', icon: Ticket },
  { path: '/notices', label: 'Notices', icon: Megaphone },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-ghost btn-md p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r-3 border-ink transform transition-transform duration-fast ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b-3 border-ink">
            <div className="bg-butter border-3 border-ink rounded-[12px] p-4 text-center">
              <span className="text-2xl font-bold font-heading text-ink tracking-tight">GATELITE</span>
            </div>
            <p className="mt-2 text-xs font-body text-ink/60 text-center">Admin Dashboard</p>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto" role="navigation" aria-label="Main">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-[12px] font-body font-medium transition-all duration-fast ease-out
                    ${isActive 
                      ? 'bg-mint text-ink border-3 border-ink shadow-card' 
                      : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
                    }
                    active:translate-x-[2px] active:translate-y-[2px] active:shadow-pressed
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t-3 border-ink">
            <div className="text-xs font-body text-ink/50 text-center">
              GateLite v0.0.1
            </div>
          </div>
        </div>
      </aside>
      
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}