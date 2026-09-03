import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * `w-full` is load-bearing. This section is a flex item (the root layout wraps it
 * in a column flex container) and `mx-auto` gives it auto cross-axis margins,
 * which opts it out of `align-items: stretch`. Without an explicit width it then
 * shrink-to-fits, taking its content's min-content width — 768px, clamped by
 * `max-w-3xl` — and overflows every viewport narrower than that.
 */
export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      {children}
    </section>
  )
}
