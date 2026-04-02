import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '../api/client';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/v1/auth/login', form);
      const token = res.data.access_token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { 
        token, 
        user: { 
          id: payload.user_id, 
          email: payload.email, 
          username: payload.email.split('@')[0], 
          status: 'active', 
          roles: payload.roles ?? [] 
        } 
      };
    },
    onSuccess: ({ token, user }) => {
      setAuth(user, token);
      navigate('/');
    },
    onError: () => setError('Invalid email or password. Please try again.'),
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 50%), var(--bg)',
    }}>
      <div className="animate-fadeIn" style={{ width: '100%', maxWidth: '400px' }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 32px rgba(99,102,241,0.4)',
          }}>
            <Zap style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h1 style={{ fontWeight: 900, fontSize: '32px', letterSpacing: '-1.5px', marginBottom: '8px' }}>
            <span className="gradient-text">MAGNET</span>
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '14px', fontWeight: 500 }}>Sign in to your support portal</p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              icon={<Mail size={18} />}
              required
            />

            <div style={{ position: 'relative' }}>
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                icon={<Lock size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  bottom: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            fullWidth
            isLoading={loginMutation.isPending}
            onClick={() => { setError(''); loginMutation.mutate(); }}
            style={{ marginTop: '8px' }}
          >
            Sign In
          </Button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-subtle)', fontWeight: 500 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
