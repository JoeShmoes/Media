"use client"
import * as React from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface ImageSlideshowProps {
  images: string[]
  className?: string
}

export function ImageSlideshow({ images, className }: ImageSlideshowProps) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className={cn("relative w-full aspect-video rounded-md overflow-hidden", className)}>
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={`Slideshow image ${index + 1}`}
            layout="fill"
            objectFit="cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
