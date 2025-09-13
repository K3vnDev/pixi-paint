'use client'

import { useEffect, useState } from 'react'
import type { GalleryCanvas } from '@/types'

export default function GalleryPage() {
  const [uplodadedCanvases, setUploadedCanvases] = useState<GalleryCanvas[]>()

  useEffect(() => {
    fetch('/api')
      .then(a => a.json())
      .then(d => console.log(d))
  }, [])
}
