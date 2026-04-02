import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginBottom: '4px' }}>
      {label && (
        <label style={{ 
          fontSize: '11px', 
          fontWeight: 800, 
          color: '#94a3b8', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em',
          paddingLeft: '4px'
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          style={{ 
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1.5px solid rgba(255, 255, 255, 0.08)',
            color: 'white',
            padding: `0 16px 0 ${icon ? '48px' : '16px'}`,
            fontSize: '15px',
            transition: 'all 0.2s',
            boxSizing: 'border-box',
            outline: 'none',
            ...style
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#6366f1';
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.15)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
          {...props}
        />
        {icon && (
          <div style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            {icon}
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: '12px', color: '#f43f5e', fontWeight: 500, paddingLeft: '4px' }}>{error}</p>}
    </div>
  );
}
