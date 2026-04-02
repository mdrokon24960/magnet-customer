import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.post('/api/v1/auth/register', form),
    onSuccess: () => navigate('/login'),
    onError: (err: any) => setError(err.response?.data?.error ?? 'Registration failed. Please try again.'),
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 0%, rgba(34,211,238,0.08) 0%, transparent 50%), var(--bg)',
    }}>
      <div className="animate-fadeIn" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 32px rgba(34,211,238,0.3)',
          }}>
            <Zap style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h1 style={{ fontWeight: 900, fontSize: '32px', letterSpacing: '-1.5px', marginBottom: '8px' }}>
            <span className="gradient-text">Create Account</span>
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '14px', fontWeight: 500 }}>Join the Magnet support portal</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{
              background: 'rgba(244,63,94,0.1)',
              border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '13px',
              color: 'var(--danger)',
              fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Username" placeholder="johndoe" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              icon={<User size={18} />} required />

            <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              icon={<Mail size={18} />} required />

            <Input label="Password" type="password" placeholder="Choose a strong password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              icon={<Lock size={18} />} required />
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-subtle)', lineHeight: 1.6, textAlign: 'center', padding: '0 8px' }}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>

          <Button style={{ marginTop: '4px' }}
            fullWidth
            isLoading={mutation.isPending}
            onClick={() => { setError(''); mutation.mutate(); }}>
            Create Account
          </Button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-subtle)', fontWeight: 500 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
