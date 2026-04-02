import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  isLoading,
  fullWidth,
  children,
  className,
  style,
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{ 
        width: fullWidth ? '100%' : 'auto',
        padding: '0 24px',
        height: '52px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #6366f1, #4338ca)',
        color: 'white',
        fontWeight: 700,
        fontSize: '15px',
        border: 'none',
        cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        display: fullWidth ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: isHovered && !disabled && !isLoading ? '0 12px 40px rgba(99, 102, 241, 0.45)' : '0 8px 30px rgba(99, 102, 241, 0.35)',
        transform: isHovered && !disabled && !isLoading ? 'translateY(-2px)' : 'translateY(0)',
        filter: isHovered && !disabled && !isLoading ? 'brightness(1.15)' : 'brightness(1)',
        opacity: (disabled || isLoading) ? 0.7 : 1,
        outline: 'none',
        ...style
      }}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (onMouseEnter) onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        if (onMouseLeave) onMouseLeave(e);
      }}
      {...props}
    >
      {isLoading ? (
        <span style={{ 
          width: '18px', 
          height: '18px', 
          border: '2.5px solid white', 
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spinAnim 0.8s linear infinite',
          display: 'inline-block'
        }} />
      ) : children}
    </button>
  );
}
