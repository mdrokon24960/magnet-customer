import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Ticket, Sparkles } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../store/auth';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { getStatusColor } from '../lib/utils';

interface TicketItem {
  ID: string;
  CustomerID: string;
  Title: string;
  Description: string;
  Status: string;
  Priority?: string | null;
  Category?: string | null;
  Summary?: string | null;
  Feedback?: string | null;
  CreatedAt?: string;
  UpdatedAt?: string;
}

const STATUSES = ['all', 'new', 'open', 'in_progress', 'resolved', 'closed'];

export function TicketsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'General', priority: 'medium' });
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  const { data: allTickets = [], isLoading } = useQuery<TicketItem[]>({
    queryKey: ['my-tickets'],
    queryFn: async () => {
      const res = await api.get('/api/v1/tickets?cb=1');
      return (res.data.tickets ?? []) as TicketItem[];
    },
    refetchInterval: 15000,
  });

  const createMutation = useMutation({
    mutationFn: () => api.post('/api/v1/tickets', {
      customer_id: user?.id,
      title: form.title,
      description: form.description,
      category: form.category,
      priority: form.priority,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      setIsModalOpen(false);
      setForm({ title: '', description: '', category: 'General', priority: 'medium' });
    },
  });

  const filtered = allTickets
    .filter(t => filterStatus === 'all' || t.Status === filterStatus)
    .filter(t => !search || t.Title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: 32, letterSpacing: '-1px', marginBottom: 6 }}>
            <span className="gradient-text">My Tickets</span>
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: 14 }}>
            {allTickets.length} ticket{allTickets.length !== 1 ? 's' : ''} — track and manage your support requests
          </p>
        </div>
        {allTickets.length > 0 && (
          <Button onClick={() => setIsModalOpen(true)} style={{ gap: 8 }}>
            <Plus style={{ width: 16, height: 16 }} />
            Submit Ticket
          </Button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 220px', minWidth: 200 }}>
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search style={{ width: 15, height: 15 }} />}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
                textTransform: s === 'all' ? 'capitalize' : 'none',
                ...(filterStatus === s
                  ? { background: 'var(--primary)', color: 'white', borderColor: 'var(--primary)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }
                  : { background: 'transparent', color: 'var(--text-subtle)', borderColor: 'var(--bg-border)' }
                ),
              }}
            >
              {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
        borderRadius: 20, overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 66 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bg-border)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Ticket style={{ width: 32, height: 32, opacity: 0.5 }} />
            </div>
            <p style={{ fontWeight: 800, fontSize: 18, color: 'white', marginBottom: 8, letterSpacing: '-0.5px' }}>
              {search ? 'No resulting tickets' : "You're all caught up!"}
            </p>
            <p style={{ fontSize: 14, maxWidth: 300, lineHeight: 1.6, marginBottom: !search ? 28 : 0 }}>
              {search ? 'Try adjusting your search or filters.' : 'If you need assistance, submit your first support ticket below to get started.'}
            </p>
            {!search && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus style={{ width: 16, height: 16, marginRight: 4 }} /> Submit Ticket
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div style={{
               display: 'grid',
               gridTemplateColumns: '1fr 130px 120px 100px',
               padding: '12px 24px',
               borderBottom: '1px solid var(--bg-border)',
               fontSize: 11, fontWeight: 700,
               color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              <span>Title</span>
              <span>Status</span>
              <span>Priority</span>
              <span style={{ textAlign: 'right' }}>AI Category</span>
            </div>
            {filtered.map((t, idx) => (
              <div
                key={t.ID}
                onClick={() => setSelectedTicket(t)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 130px 120px 100px',
                  padding: '16px 24px', cursor: 'pointer', transition: 'background 0.15s',
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--bg-border)' : 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: getStatusColor(t.Status),
                    boxShadow: `0 0 6px ${getStatusColor(t.Status)}60`,
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.Title}</p>
                    {t.Summary && <p style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.Summary}</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StatusBadge status={t.Status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {t.Priority ? (
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      textTransform: 'capitalize',
                      background: t.Priority === 'high' ? 'rgba(244,63,94,0.12)' : t.Priority === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(100,116,139,0.12)',
                      color: t.Priority === 'high' ? 'var(--danger)' : t.Priority === 'medium' ? 'var(--warning)' : 'var(--text-subtle)',
                      border: `1px solid ${t.Priority === 'high' ? 'rgba(244,63,94,0.2)' : t.Priority === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(100,116,139,0.2)'}`,
                    }}>
                      {t.Priority}
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {t.Category ? (
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <Sparkles style={{ width: 10, height: 10 }} />
                      {t.Category}
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Create ticket modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Support Ticket">
        <form
          onSubmit={e => { e.preventDefault(); createMutation.mutate(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          <Input
            label="Issue Title"
            placeholder="Briefly describe your issue..."
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Description
            </label>
            <textarea
              placeholder="Provide as much detail as possible — our AI will help classify and route your ticket..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={5}
              required
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, padding: '12px 14px', color: 'var(--text)',
                fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: '12px 14px', color: 'var(--text)',
                  fontSize: 14, outline: 'none', appearance: 'none', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              >
                {['General', 'Billing', 'Technical', 'Security', 'Other'].map(c => (
                  <option key={c} value={c} style={{ background: '#1c1c1e', color: 'white' }}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: '12px 14px', color: 'var(--text)',
                  fontSize: 14, outline: 'none', appearance: 'none', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              >
                {['low', 'medium', 'high', 'critical'].map(p => (
                  <option key={p} value={p} style={{ background: '#1c1c1e', color: 'white' }}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Sparkles style={{ width: 16, height: 16, color: 'var(--primary-light)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.5 }}>
              Our AI will automatically refine these selections based on your descriptive narrative. You'll receive updates as your ticket progresses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <Button variant="secondary" style={{ flex: 1 }} type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button style={{ flex: 1 }} type="submit" isLoading={createMutation.isPending}>Submit Ticket</Button>
          </div>
        </form>
      </Modal>

      {/* Ticket detail modal */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Ticket Details">
        {selectedTicket && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Title</p>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{selectedTicket.Title}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Description</p>
              <p style={{ fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--bg-border)' }}>
                {selectedTicket.Description || '—'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Status</p>
                <StatusBadge status={selectedTicket.Status} />
              </div>
              {selectedTicket.Priority && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Priority</p>
                  <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'capitalize', color: selectedTicket.Priority === 'high' ? 'var(--danger)' : selectedTicket.Priority === 'medium' ? 'var(--warning)' : 'var(--text-subtle)' }}>
                    {selectedTicket.Priority}
                  </span>
                </div>
              )}
              {selectedTicket.Category && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>AI Category</p>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Sparkles style={{ width: 12, height: 12 }} />
                    {selectedTicket.Category}
                  </span>
                </div>
              )}
            </div>
            {selectedTicket.Summary && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>AI Summary</p>
                <div style={{ fontSize: 13, color: 'var(--primary-light)', lineHeight: 1.6, padding: '12px 14px', background: 'rgba(99,102,241,0.04)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.15)' }}>
                  {selectedTicket.Summary}
                </div>
              </div>
            )}
            {selectedTicket.Feedback && (
              <div className="animate-fadeIn">
                <p style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                   ✨ Official Update
                </p>
                <div style={{ 
                  fontSize: 14, color: 'white', lineHeight: 1.7, padding: '18px 20px', 
                  background: 'rgba(16,185,129,0.03)', borderRadius: 16, 
                  border: '1px solid rgba(16,185,129,0.15)',
                  whiteSpace: 'pre-line',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                  {selectedTicket.Feedback}
                </div>
              </div>
            )}
            {selectedTicket.Status !== 'new' && !selectedTicket.Feedback && (
               <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bg-border)', borderRadius: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                 <div className="skeleton" style={{ width: 16, height: 16, borderRadius: '50%' }} />
                 <p style={{ fontSize: 12, color: 'var(--text-subtle)' }}>AI is still crafting your official update for this status change...</p>
               </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bg-border)',
                borderRadius: 12, padding: '12px 14px', fontSize: 12, color: 'var(--text-subtle)',
              }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Ticket ID</p>
                <p style={{ fontFamily: 'monospace' }}>{selectedTicket.ID.slice(0, 8)}...</p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bg-border)',
                borderRadius: 12, padding: '12px 14px', fontSize: 12, color: 'var(--text-subtle)',
              }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Last Activity</p>
                <p>{selectedTicket.UpdatedAt ? new Date(selectedTicket.UpdatedAt).toLocaleString() : 'Just now'}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setSelectedTicket(null)}>Close</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
