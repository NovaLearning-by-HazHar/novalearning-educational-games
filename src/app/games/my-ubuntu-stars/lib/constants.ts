/** My Ubuntu Stars — Constants */

// Themba (Gentle Protector) guide colors
export const THEMBA_COLORS = {
  body: '#F57F17',
  accent: '#FFCA28',
  skin: '#BCAAA4',
} as const;

// Point type definitions
export const POINT_TYPES = {
  langa: {
    id: 'langa' as const,
    label: { en: 'Langa', af: 'Langa', zu: 'Langa', xh: 'Langa', st: 'Langa' },
    meaning: { en: 'Sun — Completing', af: 'Son — Voltooi', zu: 'Ilanga — Ukuqeda', xh: 'Ilanga — Ukugqiba', st: 'Letsatsi — Ho phetha' },
    icon: '\u2600\uFE0F',
    color: '#FF8F00',
    bgColor: '#FFF8E1',
  },
  izulu: {
    id: 'izulu' as const,
    label: { en: 'Izulu', af: 'Izulu', zu: 'Izulu', xh: 'Izulu', st: 'Izulu' },
    meaning: { en: 'Rain — Helping', af: 'Reen — Help', zu: 'Imvula — Ukusiza', xh: 'Imvula — Ukunceda', st: 'Pula — Ho thusa' },
    icon: '\uD83C\uDF27\uFE0F',
    color: '#1565C0',
    bgColor: '#E3F2FD',
  },
  umhlaba: {
    id: 'umhlaba' as const,
    label: { en: 'Umhlaba', af: 'Umhlaba', zu: 'Umhlaba', xh: 'Umhlaba', st: 'Umhlaba' },
    meaning: { en: 'Earth — Discovering', af: 'Aarde — Ontdek', zu: 'Umhlaba — Ukuthola', xh: 'Umhlaba — Ukufumana', st: 'Lefatshe — Ho fumana' },
    icon: '\uD83C\uDF0D',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
  },
} as const;

export type PointType = keyof typeof POINT_TYPES;

// Game mode definitions
export const GAME_MODES = {
  'count-to-five': {
    label: { en: 'Count to Five', af: 'Tel tot Vyf', zu: 'Bala Kuze Kube Kuhlanu', xh: 'Bala Ukuya Kwisihlanu', st: 'Bala ho isa ho Hlano' },
    icon: '\uD83D\uDD22',
  },
  'trace-letter-a': {
    label: { en: 'Trace Letter A', af: 'Trek Letter A', zu: 'Landa Uhlamvu A', xh: 'Landa Unobumba A', st: 'Latela Tlhaku A' },
    icon: '\u270D\uFE0F',
  },
  'bontse': {
    label: { en: 'Bontse', af: 'Bontse', zu: 'Bontse', xh: 'Bontse', st: 'Bontse' },
    icon: '\uD83D\uDD0D',
  },
  'mzansi-journey': {
    label: { en: 'Mzansi Journey', af: 'Mzansi Reis', zu: 'Uhambo LwaseMzansi', xh: 'Uhambo LwaseMzansi', st: 'Leeto la Mzansi' },
    icon: '\uD83D\uDDFA\uFE0F',
  },
  'ubuntu-stories': {
    label: { en: 'Ubuntu Stories', af: 'Ubuntu Verhale', zu: 'Izindaba Ze-Ubuntu', xh: 'Amabali e-Ubuntu', st: 'Lipale tsa Ubuntu' },
    icon: '\uD83D\uDCDA',
  },
  'ubuntu-garden': {
    label: { en: 'Ubuntu Garden', af: 'Ubuntu Tuin', zu: 'Ingadi Ye-Ubuntu', xh: 'Igadi ye-Ubuntu', st: 'Serapa sa Ubuntu' },
    icon: '\uD83C\uDF31',
  },
  'thina-trivia': {
    label: { en: 'Thina Trivia', af: 'Thina Trivia', zu: 'Thina Trivia', xh: 'Thina Trivia', st: 'Thina Trivia' },
    icon: '\u2753',
  },
  'community': {
    label: { en: 'Community', af: 'Gemeenskap', zu: 'Umphakathi', xh: 'Uluntu', st: 'Setjhaba' },
    icon: '\uD83E\uDD1D',
  },
} as const;

export type GameMode = keyof typeof GAME_MODES;

// UI
export const BACKGROUND_GRADIENT = {
  from: '#FFF8F0',
  to: '#FFF3E0',
} as const;

// Language options
export const LANG_OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'af', label: 'AF' },
  { code: 'zu', label: 'ZU' },
  { code: 'xh', label: 'XH' },
  { code: 'st', label: 'ST' },
] as const;

// Tab types
export type TabType = 'individual' | 'community';

// Language key type
export type LangCode = 'en' | 'af' | 'zu' | 'xh' | 'st';

/** Type-safe language lookup — falls back to English */
export function t(obj: Record<string, string>, lang: string): string {
  return obj[lang] || obj.en;
}

// UI text translations
export const UI_TEXT = {
  title: { en: 'My Ubuntu Stars', af: 'My Ubuntu Sterre', zu: 'Izinkanyezi Zami Ze-Ubuntu', xh: 'Iinkwenkwezi Zam ze-Ubuntu', st: 'Linaleli tsa Ka tsa Ubuntu' },
  individual: { en: 'Individual', af: 'Individueel', zu: 'Umuntu ngamunye', xh: 'Umntu ngamnye', st: 'Motho ka mong' },
  community: { en: 'Community', af: 'Gemeenskap', zu: 'Umphakathi', xh: 'Uluntu', st: 'Setjhaba' },
  earned: { en: 'Earned', af: 'Verdien', zu: 'Kuzuzile', xh: 'Ifunyenwe', st: 'E fumanwe' },
  locked: { en: 'Keep exploring!', af: 'Hou aan verken!', zu: 'Qhubeka uhlole!', xh: 'Qhubeka uphonononga!', st: 'Tswela pele o hlahloba!' },
  togetherMessage: { en: 'Look what we achieved together!', af: 'Kyk wat het ons saam bereik!', zu: 'Bheka esikuzuzile ndawonye!', xh: 'Jonga esikufezileyo kunye!', st: 'Sheba seo re se fihletseng mmoho!' },
  close: { en: 'Close', af: 'Sluit', zu: 'Vala', xh: 'Vala', st: 'Kwala' },
  mode: { en: 'Earned in', af: 'Verdien in', zu: 'Kuzuzile ku', xh: 'Ifunyenwe ku', st: 'E fumanwe ho' },
  milestonePrefix: { en: 'Class milestone', af: 'Klas mylpaal', zu: 'Isigaba seklasi', xh: 'Ilitye lesigaba leklasi', st: 'Mohato oa sehlopha' },
} as const;
