import { forwardRef } from 'react';

const IconButton = forwardRef(({ 
  icon: Icon,
  size = 'md',
  variant = 'default',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'text-gray-600 hover:bg-white/40 hover:text-gray-800 transition-colors',
    primary: 'btn-glass text-gray-600',
    secondary: 'text-gray-500 hover:bg-white/10 hover:text-gray-700 transition-colors',
    ghost: 'text-gray-600 hover:bg-white/10 transition-colors',
  };
  
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  const iconSize = iconSizes[size] || 20;
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button ref={ref} className={classes} {...props}>
      <Icon size={iconSize} />
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
