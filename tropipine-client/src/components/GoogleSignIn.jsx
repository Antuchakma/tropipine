import { useEffect, useRef } from 'react'

export default function GoogleSignIn({ onSuccess, disabled }) {
  const btnRef = useRef(null)

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId || !btnRef.current) return

    const init = () => {
      if (!window.google?.accounts?.id) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => onSuccess(response.credential),
      })
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
      })
    }

    if (window.google?.accounts?.id) {
      init()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = init
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [onSuccess])

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <p className="text-xs text-ink-faint text-center">
        Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in
      </p>
    )
  }

  return <div ref={btnRef} className={disabled ? 'opacity-50 pointer-events-none' : ''} />
}
