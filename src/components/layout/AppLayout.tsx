import type { ReactNode } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, User, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'My Tickets',  icon: Ticket,          href: '/tickets' },
    { label: 'Profile',     icon: User,            href: '/profile' },
  ];

  const initials = user.username?.[0]?.toUpperCase() ?? 'U';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--bg-border)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        inset: '0 auto 0 0',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 8px 32px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#6366f1,#818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.35)',
          }}>
            <Zap style={{ width: 18, height: 18, color: 'white' }} />
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>MAGNET</p>
            <p style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Support Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className="nav-link"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.2s',
                textDecoration: 'none',
                ...(isActive
                  ? {
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary-light)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }
                  : {
                      background: 'transparent',
                      color: 'var(--text-subtle)',
                      border: '1px solid transparent',
                    }),
              })}
              onMouseEnter={(e) => {
                if (!window.location.pathname.endsWith(item.href) && !(item.href === '/' && window.location.pathname === '/')) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!window.location.pathname.endsWith(item.href) && !(item.href === '/' && window.location.pathname === '/')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-subtle)';
                }
              }}
            >
              <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--bg-border)',
          paddingTop: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 12,
            background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#6366f1,#22d3ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: 'white',
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</p>
              <p style={{ fontSize: 11, color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 12,
              background: 'transparent', border: 'none',
              color: 'var(--danger)', fontWeight: 600, fontSize: 13,
              transition: 'all 0.2s', cursor: 'pointer', width: '100%',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(244,63,94,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut style={{ width: 16, height: 16 }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 260, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '40px 48px', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
