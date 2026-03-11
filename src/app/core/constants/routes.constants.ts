export const routes = {
  auth: {
    ROOT: '/auth',
    SIGN_IN: '/auth/full/sign-in',
    SIGN_UP: '/auth/full/sign-up',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    NEW_PASSWORD: '/auth/new-password',
  },
  home: '/',
} as const;