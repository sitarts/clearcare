import { useEffect, useRef } from 'react'

type KeyModifiers = {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
}

export function useHotkey(
  key: string,
  callback: () => void,
  modifiers: KeyModifiers = {},
  enabled = true
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase()
      const matchesMeta = modifiers.meta ? event.metaKey : !event.metaKey
      const matchesCtrl = modifiers.ctrl ? event.ctrlKey : !event.ctrlKey
      const matchesShift = modifiers.shift ? event.shiftKey : !event.shiftKey
      const matchesAlt = modifiers.alt ? event.altKey : !event.altKey

      if (matchesKey && matchesMeta && matchesCtrl && matchesShift && matchesAlt) {
        event.preventDefault()
        callbackRef.current()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, modifiers.meta, modifiers.ctrl, modifiers.shift, modifiers.alt, enabled])
}

// Cmd+K or Ctrl+K for search (cross-platform)
export function useSearchHotkey(callback: () => void, enabled = true) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      const isK = event.key.toLowerCase() === 'k'
      const hasModifier = event.metaKey || event.ctrlKey

      if (isK && hasModifier) {
        event.preventDefault()
        callbackRef.current()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [enabled])
}

// Escape key handler
export function useEscapeKey(callback: () => void, enabled = true) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callbackRef.current()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [enabled])
}
