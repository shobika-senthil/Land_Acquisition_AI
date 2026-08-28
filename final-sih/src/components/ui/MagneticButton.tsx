import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  onClick,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.25;
    const y = (clientY - (top + height / 2)) * 0.25;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantClasses = {
    primary: 'bg-earth-900 text-sandal-50 hover:bg-earth-950 shadow-sandal hover:shadow-sandal-lg border border-earth-800',
    secondary: 'bg-terracotta-600 text-white hover:bg-terracotta-700 shadow-sandal hover:shadow-sandal-lg border border-terracotta-700',
    outline: 'bg-ivory/80 text-earth-900 hover:bg-sandal-100 border border-sandal-300 shadow-sandal-sm',
    ghost: 'bg-transparent text-earth-800 hover:bg-sandal-200/60 border border-transparent',
  }[variant];

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 rounded-lg gap-1.5 font-medium',
    md: 'text-sm px-5 py-2.5 rounded-xl gap-2 font-semibold',
    lg: 'text-base px-7 py-3.5 rounded-2xl gap-2.5 font-bold',
  }[size];

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 220, damping: 15, mass: 0.2 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition-colors active:scale-95 cursor-pointer select-none ${variantClasses} ${sizeClasses} ${className}`}
      {...props as any}
    >
      <span>{children}</span>
      {icon && <span className="transition-transform duration-200 group-hover:translate-x-1">{icon}</span>}
    </motion.button>
  );
};
