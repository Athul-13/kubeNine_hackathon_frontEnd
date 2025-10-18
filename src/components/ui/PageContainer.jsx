import { forwardRef } from 'react';

const PageContainer = forwardRef(({ 
  children, 
  title,
  subtitle,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'p-4 md:p-8';
  
  const classes = `${baseClasses} ${className}`;
  
  return (
    <div ref={ref} className={classes} {...props}>
      {title && (
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 drop-shadow-sm">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-gray-700 mb-6 drop-shadow-sm">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
});

PageContainer.displayName = 'PageContainer';

export default PageContainer;
