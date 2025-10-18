import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  variant = 'default',
  padding = 'md',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'rounded-2xl';
  
  const variants = {
    default: 'glass',
    elevated: 'glass-strong',
    flat: 'glass-subtle',
    outlined: 'glass-dark',
    strong: 'glass-strong',
    subtle: 'glass-subtle',
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${className}`;
  
  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
