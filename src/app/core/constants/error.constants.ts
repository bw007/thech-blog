export const authErrors: Record<string, string> = {
  // Credentials
  'invalid_credentials': 'Email yoki parol noto\'g\'ri',
  'user_not_found': 'Foydalanuvchi topilmadi',
  'user_banned': 'Hisobingiz bloklangan',
  'signup_disabled': 'Ro\'yxatdan o\'tish vaqtincha to\'xtatilgan',
  'email_exists': 'Bu email allaqachon ro\'yxatdan o\'tgan',
  'user_already_exists': 'Bu foydalanuvchi allaqachon mavjud',
  'weak_password': 'Parol juda oddiy, kuchliroq parol kiriting',
  'same_password': 'Yangi parol avvalgisidan farq qilishi kerak',

  // Email
  'email_not_confirmed': 'Emailni tasdiqlang, pochtangizni tekshiring',
  'email_provider_disabled': 'Email orqali kirish o\'chirilgan',
  'over_email_send_rate_limit': 'Juda ko\'p email yuborildi, biroz kuting',
  'email_address_invalid': 'Email manzil noto\'g\'ri',

  // OTP / Magic link
  'otp_expired': 'Tasdiqlash kodi eskirgan, qaytadan so\'rang',
  'otp_disabled': 'Kod orqali kirish o\'chirilgan',

  // OAuth
  'oauth_provider_not_supported': 'Bu ijtimoiy tarmoq orqali kirish qo\'llab-quvvatlanmaydi',
  'provider_disabled': 'Bu orqali kirish o\'chirilgan',
  'provider_email_needs_verification': 'Emailingizni tasdiqlang, pochtangizni tekshiring',

  // Session / Token
  'session_expired': 'Sessiya muddati tugadi, qaytadan kiring',
  'session_not_found': 'Sessiya topilmadi, qaytadan kiring',
  'refresh_token_not_found': 'Sessiya topilmadi, qaytadan kiring',
  'refresh_token_already_used': 'Sessiya yaroqsiz, qaytadan kiring',

  // Rate limit
  'over_request_rate_limit': 'Juda ko\'p urinish, biroz kuting',
  'over_sms_send_rate_limit': 'Juda ko\'p SMS yuborildi, biroz kuting',

  // Server
  'unexpected_failure': 'Server xatosi, qaytadan urinib ko\'ring',
  'request_timeout': 'Ulanish vaqti tugadi, qaytadan urinib ko\'ring',
} as const;