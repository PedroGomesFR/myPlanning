import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from './locales/en.json';
import frJSON from './locales/fr.json';
import esJSON from './locales/es.json';
import deJSON from './locales/de.json';
import itJSON from './locales/it.json';
import ptJSON from './locales/pt.json';
import arJSON from './locales/ar.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { ...enJSON },
            fr: { ...frJSON },
            es: { ...esJSON },
            de: { ...deJSON },
            it: { ...itJSON },
            pt: { ...ptJSON },
            ar: { ...arJSON },
        },
        lng: "fr", // Default language
        fallbackLng: "fr",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
