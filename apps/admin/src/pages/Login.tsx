import { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AuthLayout } from '../components/layout';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement actual login
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full">
        <div className="text-center mb-8">
          <div className="bg-butter border-3 border-ink rounded-[12px] p-4 inline-block mb-6">
            <span className="text-3xl font-bold font-heading text-ink tracking-tight">GATELITE</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-ink mb-2">Sign in to Admin</h1>
          <p className="text-ink/60 font-body">Enter your credentials to access the dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose/10 border-2 border-rose rounded-[8px] flex items-center gap-3 animate-slide-in" role="alert">
            <AlertCircle className="w-5 h-5 text-rose flex-shrink-0" aria-hidden="true" />
            <p className="text-sm font-body text-rose">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gate-lite.com"
            leftIcon={<Mail className="w-5 h-5" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            leftIcon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-ink/40 hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 border-3 border-ink rounded-[4px] accent-mint"
              />
              <span className="text-sm font-body text-ink/70">Remember me</span>
            </label>
            <a href="#" className="text-sm font-body text-sky hover:underline">Forgot password?</a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-ink">
          <p className="text-center text-sm font-body text-ink/60">
            Demo credentials: <br />
            <code className="font-mono text-sm bg-ink/5 px-2 py-1 rounded-[4px]">admin@gate-lite.com</code> / <code className="font-mono text-sm bg-ink/5 px-2 py-1 rounded-[4px]">password123</code>
          </p>
        </div>
      </Card>
    </AuthLayout>
  );
}