import { useState } from 'react';
import { Shield, Mail, Smartphone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Login() {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (method === 'phone' && value.length >= 10) {
      setStep('otp');
      startTimer();
    } else if (method === 'email' && value.includes('@')) {
      setStep('otp');
      startTimer();
    } else {
      setError('Please enter a valid phone number or email');
    }
    setLoading(false);
  };
  
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const otpCode = otp.join('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otpCode === '123456' || otpCode.length === 6) {
      // Success - redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      setError('Invalid OTP. Try 123456 for demo.');
    }
    setLoading(false);
  };
  
  const handleOtpChange = (index: number, value: string) => {
    if (value.length === 1 && index < 5) {
      const inputs = document.querySelectorAll('.otp-box') as NodeListOf<HTMLInputElement>;
      inputs[index + 1]?.focus();
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };
  
  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };
  
  const resendOtp = () => {
    if (timer === 0) {
      setError('');
      startTimer();
      // Simulate resend
    }
  };
  
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-butter border-3 border-ink rounded-[12px] p-6 inline-block mb-4">
            <span className="text-3xl font-bold font-heading text-ink tracking-tight">GATELITE</span>
          </div>
          <p className="text-ink/60 font-body">Admin Dashboard</p>
        </div>
        
        {step === 'input' ? (
          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-2">Sign In</h2>
            <p className="text-ink/60 font-body mb-6">Enter your phone or email to receive a one-time code</p>
            
            {error && (
              <div className="mb-4 p-3 bg-rose/10 border-2 border-rose rounded-[8px] text-sm text-rose font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={`flex-1 btn btn-md flex items-center justify-center gap-2 ${
                    method === 'phone' ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={`flex-1 btn btn-md flex items-center justify-center gap-2 ${
                    method === 'email' ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium font-body text-ink mb-2">
                  {method === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">
                    {method === 'phone' ? '+91' : '@'}
                  </span>
                  <input
                    type={method === 'phone' ? 'tel' : 'email'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={method === 'phone' ? '98765 43210' : 'admin@example.com'}
                    className="input pl-10"
                    inputMode={method === 'phone' ? 'tel' : 'email'}
                    autoComplete={method === 'phone' ? 'tel' : 'email'}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full btn btn-primary btn-lg"
                disabled={loading || !value}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
            
            <p className="text-xs text-ink/50 text-center mt-6">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-ink">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-ink">Privacy Policy</a>
            </p>
            
            <div className="mt-6 pt-6 border-t-2 border-ink text-center">
              <p className="text-sm text-ink/60">Demo OTP: <code className="font-mono bg-ink/10 px-1 rounded">123456</code></p>
            </div>
          </Card>
        ) : (
          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-2">Verify Code</h2>
            <p className="text-ink/60 font-body mb-6">
              Enter the 6-digit code sent to <strong>{method === 'phone' ? `+91 ${value}` : value}</strong>
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-rose/10 border-2 border-rose rounded-[8px] text-sm text-rose font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="otp-boxes">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        const inputs = document.querySelectorAll('.otp-box') as NodeListOf<HTMLInputElement>;
                        inputs[index - 1]?.focus();
                      }
                    }}
                    className="otp-box"
                    maxLength={1}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    disabled={loading}
                  />
                ))}
              </div>
              
              <button
                type="submit"
                className="w-full btn btn-primary btn-lg"
                disabled={loading || otp.some(d => !d)}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Sign In'
                )}
              </button>
            </form>
            
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="btn btn-ghost btn-sm"
              >
                ← Change method
              </button>
              
              <button
                type="button"
                onClick={resendOtp}
                disabled={timer > 0}
                className="btn btn-ghost btn-sm"
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t-2 border-ink text-center">
              <p className="text-sm text-ink/60">Demo OTP: <code className="font-mono bg-ink/10 px-1 rounded">123456</code></p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}