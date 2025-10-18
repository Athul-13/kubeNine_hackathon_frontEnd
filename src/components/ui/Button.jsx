import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  icon, 
  iconPosition = 'left',
  showLabel = true,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'btn-glass text-gray-800 hover:text-gray-900 focus:ring-gray-500',
    primary: 'btn-glass-primary text-white focus:ring-blue-500',
    secondary: 'btn-glass text-gray-700 hover:text-gray-800 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-white/10 focus:ring-gray-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
    'icon-sm': 'p-1.5',
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    icon: 24,
    'icon-sm': 20,
  };
  
  const iconSize = iconSizes[size] || 20;
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const renderContent = () => {
    if (icon && !showLabel) {
      // Icon-only button
      return <icon size={iconSize} />;
    }
    
    if (icon && showLabel) {
      // Icon + text button
      return (
        <>
          {iconPosition === 'left' && <icon size={iconSize} className="mr-2" />}
          {children}
          {iconPosition === 'right' && <icon size={iconSize} className="ml-2" />}
        </>
      );
    }
    
    return children;
  };
  
  return (
    <button ref={ref} className={classes} {...props}>
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
