import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  Ticket,
  Megaphone,
  Settings,
  Menu,
  X,
  Shield,
  Bell,
  Home,
  Briefcase,
  ClipboardList,
  CreditCard,
  Wrench,
  FileText,
  Users2,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/societies', label: 'Societies', icon: Building2 },
  { path: '/residents', label: 'Residents', icon: Users },
  { path: '/visitors', label: 'Visitors', icon: UserCheck },
  { path: '/passes', label: 'Passes', icon: Shield },
  { path: '/notices', label: 'Notices', icon: Megaphone },
  { path: '/tickets', label: 'Tickets', icon: Ticket },
  { path: '/staff', label: 'Staff', icon: Users2 },
  { path: '/amenities', label: 'Amenities', icon: Briefcase },
  { path: '/billing', label: 'Billing', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <button
        className={clsx(
          'fixed lg:hidden top-4 left-4 z-50 btn btn-ghost btn-md p-2',
          collapsed && 'left-20',
        )}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
      >
        {collapsed ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
      </button>

      <button
        className="lg:hidden fixed top-4 left-16 z-50 btn btn-ghost btn-md p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-40 bg-white border-r-3 border-ink transition-all duration-fast ease-out',
          'flex flex-col',
          collapsed ? 'w-20' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={clsx('p-4 border-b-3 border-ink flex items-center justify-between', collapsed && 'justify-center')}>
            {!collapsed && (
              <div className="bg-butter border-3 border-ink rounded-[12px] p-4 text-center w-full">
                <span className="text-2xl font-bold font-heading text-ink tracking-tight">GATELITE</span>
              </div>
            )}
            {collapsed && (
              <div className="bg-butter border-3 border-ink rounded-[12px] p-3 text-center">
                <span className="text-xl font-bold font-heading text-ink">GL</span>
              </div>
            )}
            {!collapsed && (
              <p className="mt-2 text-xs font-body text-ink/60 text-center hidden md:block">Admin Dashboard</p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto" role="navigation" aria-label="Main">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive: active }) => clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-body font-medium transition-all duration-fast ease-out',
                    'active:translate-x-[2px] active:translate-y-[2px] active:shadow-pressed',
                    active
                      ? 'bg-mint text-ink border-3 border-ink shadow-card'
                      : 'text-ink/70 hover:bg-ink/5 hover:text-ink',
                    collapsed && 'justify-center px-2',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={clsx('w-5 h-5 flex-shrink-0', collapsed && 'mx-auto')} aria-hidden="true" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {item.badge && !collapsed && (
                    <span className="ml-auto badge badge-primary text-[10px]">{item.badge}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t-3 border-ink">
            {!collapsed && (
              <div className="text-xs font-body text-ink/50 text-center">
                GateLite v0.0.1
              </div>
            )}
            {collapsed && (
              <div className="text-center">
                <span className="text-xs font-bold font-heading text-ink">GL</span>
              </div>
            )}
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