import Cookies from 'js-cookie'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import { i18n } from '.'
import type { Locale } from '.'

/**
 * Detect locale on client side (replacement for getLocaleOnServer)
 * Uses cookie first, then browser's Accept-Language header
 */
export const detectLocale = async (): Promise<Locale> => {
  const locales: string[] = i18n.locales

  // get locale from cookie
  const localeCookie = Cookies.get('locale')
  let languages: string[] | undefined

  if (localeCookie)
    languages = [localeCookie]

  if (!languages || !languages.length) {
    // Use browser's navigator.languages
    const negotiatorHeaders: Record<string, string> = {
      'accept-language': navigator.languages.join(', '),
    }
    languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  }

  // Validate languages
  if (!Array.isArray(languages) || languages.length === 0 || !languages.every(lang => typeof lang === 'string' && /^[\w-]+$/.test(lang)))
    languages = [i18n.defaultLocale]

  // match locale
  const matchedLocale = match(languages, locales, i18n.defaultLocale) as Locale
  return matchedLocale
}
