import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'pink';
  fullWidth?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  variant = 'cyan', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative group font-mono font-bold tracking-widest uppercase py-3 px-6 transition-all duration-300 ease-out clip-path-polygon border-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg";
  
  const variants = {
    cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black focus:ring-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-neon-cyan",
    pink: "border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black focus:ring-neon-pink shadow-[0_0_10px_rgba(255,0,255,0.2)] hover:shadow-neon-pink"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Glitch effect overlay on hover could go here, keeping it simple for now */}
    </button>
  );
};

export default NeonButton;
