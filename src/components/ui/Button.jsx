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
    default: 'text-gray-600 hover:bg-white/40 hover:text-gray-800 transition-colors',
    primary: 'btn-glass text-gray-600',
    secondary: 'text-gray-500 hover:bg-white/10 hover:text-gray-700 transition-colors',
    ghost: 'text-gray-600 hover:bg-white/10 transition-colors',
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
