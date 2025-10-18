import { forwardRef } from 'react';

const IconButton = forwardRef(({ 
  icon: Icon,
  size = 'md',
  variant = 'default',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'btn-glass text-gray-700 hover:text-gray-800 focus:ring-gray-500',
    primary: 'btn-glass-primary text-white focus:ring-blue-500',
    secondary: 'btn-glass text-gray-600 hover:text-gray-700 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-white/10 focus:ring-gray-500',
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
