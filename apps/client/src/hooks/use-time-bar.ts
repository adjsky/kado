import React, { useEffect, useState } from "react"

const easingFunctions = {
  linear: (time: number, begin: number, change: number, duration: number) => {
    return (change * time) / duration + begin
  }
}

const useTimeBar = (timestamp?: number | null) => {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (!timestamp) {
      return
    }

    const expectedStart = timestamp - 60 * 1000
    const start = Date.now()
    const begin = ((start - expectedStart) / (timestamp - expectedStart)) * 100
    const change = 100 - begin
    const duration = timestamp - start

    let requestId: number | null = null
    const calculatePosition = () => {
      const now = Date.now()
      if (now > timestamp) {
        requestId = null
        return
      }

      const time = now - start
      setPosition(easingFunctions["linear"](time, begin, change, duration))
      requestId = requestAnimationFrame(calculatePosition)
    }

    requestId = requestAnimationFrame(calculatePosition)

    return () => {
      if (requestId) cancelAnimationFrame(requestId)
      setPosition(0)
    }
  }, [timestamp])

  const styles: React.CSSProperties = { width: position + "%" }

  return styles
}

export default useTimeBar
