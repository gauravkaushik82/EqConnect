import React from 'react'
import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  count?: number
}

const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'shimmer-loader rounded-lg',
            className || 'h-12 w-full mb-4'
          )}
        />
      ))}
    </>
  )
}

export default Skeleton
