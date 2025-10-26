import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white rounded-lg',
      bordered: 'bg-white border border-gray-200 rounded-lg',
      elevated: 'bg-white shadow-lg rounded-lg',
    }

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div ref={ref} className={cn(variants[variant], paddings[padding], className)} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
