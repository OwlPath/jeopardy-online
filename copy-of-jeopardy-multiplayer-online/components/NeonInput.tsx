import React from 'react';

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const NeonInput: React.FC<NeonInputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className={`relative group ${className}`}>
      <label className="block text-neon-cyan font-mono text-xs uppercase tracking-widest mb-1 ml-1 opacity-80 group-focus-within:opacity-100 group-focus-within:text-white transition-all">
        {label}
      </label>
      <div className="relative">
        <input
          className="w-full bg-dark-bg/50 border border-white/20 text-white font-sans text-lg px-4 py-3 outline-none transition-all duration-300 focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] placeholder-white/10"
          autoComplete="off"
          {...props}
        />
        <div className="absolute inset-0 border border-white/0 pointer-events-none group-focus-within:border-neon-cyan/50 animate-pulse"></div>
        {icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neon-cyan/70">
            {icon}
          </div>
        )}
      </div>
      {/* Corner accents */}
      <div className="absolute top-6 -left-[1px] w-2 h-2 border-l border-t border-neon-cyan opacity-0 group-focus-within:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 -right-[1px] w-2 h-2 border-r border-b border-neon-cyan opacity-0 group-focus-within:opacity-100 transition-opacity" />
    </div>
  );
};

export default NeonInput;
