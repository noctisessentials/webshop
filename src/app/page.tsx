import { redirect } from 'next/navigation'

// The middleware handles locale routing, but this fallback ensures
// direct hits to / are redirected to the default locale.
export default function RootPage() {
  redirect('/nl')
}
