import { useAuthStore } from '../store/auth';
import { User, Mail, Shield, Fingerprint } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  const fields = [
    { label: 'User ID',   value: user.id,                  icon: Fingerprint },
    { label: 'Username',  value: user.username,             icon: User },
    { label: 'Email',     value: user.email,                icon: Mail },
    { label: 'Status',    value: user.status ?? 'active',   icon: Shield },
    { label: 'Roles',     value: (user.roles ?? []).join(', ') || 'customer', icon: Shield },
  ];

  const initials = user.username?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 640 }}>
      <div>
        <h1 style={{ fontWeight: 900, fontSize: 32, letterSpacing: '-1px', marginBottom: 6 }}>
          <span className="gradient-text">My Profile</span>
        </h1>
        <p style={{ color: 'var(--text-subtle)', fontSize: 14 }}>Your account information and access details.</p>
      </div>

      {/* Avatar card */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
        borderRadius: 20, padding: '28px 28px',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 28, color: 'white',
          boxShadow: '0 0 32px rgba(99,102,241,0.4)',
        }}>
          {initials}
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px' }}>{user.username}</p>
          <p style={{ color: 'var(--text-subtle)', fontSize: 14, marginTop: 2 }}>{user.email}</p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8,
            padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
            Active
          </div>
        </div>
      </div>

      {/* Info fields */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
        borderRadius: 20, overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--bg-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: 14 }}>Account Details</h2>
        </div>
        {fields.map(({ label, value, icon: Icon }, i) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px',
            borderBottom: i < fields.length - 1 ? '1px solid var(--bg-border)' : 'none',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon style={{ width: 16, height: 16, color: 'var(--primary-light)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-all' }}>{value || '—'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info notice */}
      <div style={{
        background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)',
        borderRadius: 14, padding: '14px 18px', fontSize: 13, color: 'var(--text-subtle)', lineHeight: 1.6,
      }}>
        To update your account details or change your password, please contact the support team by submitting a ticket.
      </div>
    </div>
  );
}
