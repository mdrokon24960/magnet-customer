import { useQuery } from '@tanstack/react-query';
import { Ticket, CheckCircle2, Clock, AlertCircle, PlusCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuthStore } from '../store/auth';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { getStatusColor } from '../lib/utils';

interface TicketItem {
  ID: string;
  CustomerID: string;
  Title: string;
  Status: string;
  Priority?: string | null;
  Category?: string | null;
  CreatedAt?: string;
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: allTickets = [], isLoading } = useQuery<TicketItem[]>({
    queryKey: ['my-tickets'],
    queryFn: async () => {
      const res = await api.get('/api/v1/tickets?cb=1');
      return (res.data.tickets ?? []) as TicketItem[];
    },
  });

  const stats = {
    total:      allTickets.length,
    open:       allTickets.filter(t => ['new','open','in_progress'].includes(t.Status)).length,
    resolved:   allTickets.filter(t => t.Status === 'resolved').length,
    closed:     allTickets.filter(t => t.Status === 'closed').length,
  };

  const recent = [...allTickets].slice(0, 5);

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: 32, letterSpacing: '-1px', marginBottom: 6 }}>
            Welcome back, <span className="gradient-text">{user?.username}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: 14 }}>Here's an overview of your support activity.</p>
        </div>
        <Link to="/tickets">
          <Button style={{ gap: 8 }}>
            <PlusCircle style={{ width: 16, height: 16 }} />
            New Ticket
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {[
          { label: 'Total Tickets', value: stats.total, icon: Ticket, color: '#6366f1' },
          { label: 'Open / In Progress', value: stats.open, icon: AlertCircle, color: '#f59e0b' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: '#10b981' },
          { label: 'Closed', value: stats.closed, icon: Clock, color: '#64748b' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
            borderRadius: 16, padding: '20px 22px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
              <div style={{
                width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${color}15`, flexShrink: 0,
              }}>
                <Icon style={{ width: 16, height: 16, color }} />
              </div>
            </div>
            {isLoading
              ? <div className="skeleton" style={{ width: 48, height: 32 }} />
              : <p style={{ fontWeight: 900, fontSize: 32, lineHeight: 1, letterSpacing: '-1px', color: '#f1f5f9' }}>{value}</p>
            }
          </div>
        ))}
      </div>

      {/* Recent tickets */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
        borderRadius: 20, overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp style={{ width: 18, height: 18, color: 'var(--primary-light)' }} />
            <h2 style={{ fontWeight: 700, fontSize: 15 }}>Recent Tickets</h2>
          </div>
          <Link to="/tickets" style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600 }}>View all →</Link>
        </div>

        {isLoading ? (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 40 }} />)}
          </div>
        ) : recent.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-subtle)' }}>
            <Ticket style={{ width: 40, height: 40, margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontWeight: 600 }}>No tickets yet</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Submit your first support request to get started.</p>
          </div>
        ) : (
          <div>
            {recent.map((t, idx) => (
              <div key={t.ID} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px',
                borderBottom: idx < recent.length - 1 ? '1px solid var(--bg-border)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: getStatusColor(t.Status),
                  boxShadow: `0 0 6px ${getStatusColor(t.Status)}`,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.Title}</p>
                  {t.Category && <p style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>{t.Category}</p>}
                </div>
                <StatusBadge status={t.Status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
