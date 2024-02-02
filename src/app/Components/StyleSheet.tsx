'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { getCssText } from '@ignite-ui/react'
import { globalStyles } from '../styles/global'

export default function StitchesRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [isRendered, setIsRendered] = useState(false)

  useServerInsertedHTML(() => {
    if (!isRendered) {
      setIsRendered(true)
      return (
        <style
          id="stitches"
          dangerouslySetInnerHTML={{
            __html: `${getCssText()} ${globalStyles()}`,
          }}
        />
      )
    }
  })

  return <>{children}</>
}
