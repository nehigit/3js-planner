import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './en.json'
import pl from './pl.json'

// `en.json` is the reference: every key lives there, `pl.json` mirrors it.
// A key missing from Polish falls back to English (and warns in dev).
export const LANGUAGES = ['en', 'pl']

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            pl: { translation: pl },
        },
        supportedLngs: LANGUAGES,
        fallbackLng: 'en',
        // language tags like "pl-PL" resolve to "pl"
        load: 'languageOnly',
        detection: {
            // the user's choice wins, then the browser language
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'language',
            caches: ['localStorage'],
        },
        interpolation: {
            // React already escapes rendered strings
            escapeValue: false,
        },
        saveMissing: import.meta.env.DEV,
        missingKeyHandler: (lngs, ns, key) => console.warn(`i18n: missing key "${key}" for ${lngs}`),
    })

// so screen readers, spellcheck and hyphenation follow the chosen language
function syncDocumentLang(lng) {
    document.documentElement.lang = lng
}
syncDocumentLang(i18n.resolvedLanguage)
i18n.on('languageChanged', syncDocumentLang)

export default i18n
