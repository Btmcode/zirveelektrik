import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

/**
 * Mobil görünüm tespiti — React 18'in kanonik useSyncExternalStore deseni.
 * matchMedia aboneliği dış sistem olarak yönetilir; setState-in-effect
 * ve hidrasyon uyumsuzluğu riski olmaz.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false // SSR anında mobil varsayılmaz
  )
}
