import { forwardRef } from 'react';

const ResponsiveContainer = forwardRef(({ 
  children, 
  desktopLayout = 'flex',
  mobileLayout = 'flex-col',
  gap = '4',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'flex';
  const desktopClasses = `hidden md:${desktopLayout}`;
  const mobileClasses = `md:hidden ${mobileLayout}`;
  const gapClasses = `gap-${gap}`;
  
  const classes = `${baseClasses} ${desktopClasses} ${mobileClasses} ${gapClasses} ${className}`;
  
  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

ResponsiveContainer.displayName = 'ResponsiveContainer';

export default ResponsiveContainer;
