import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { clsx } from 'clsx';

interface LayoutProps {
  className?: string;
}

export function Layout({ className = '' }: LayoutProps) {
  return (
    <div className={clsx('min-h-screen bg-paper', className)}>
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}