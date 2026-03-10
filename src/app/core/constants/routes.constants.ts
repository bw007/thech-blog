export const routes = {
  auth: {
    root: '/auth',
    signIn: '/auth/full/sign-in',
    signUp: '/auth/full/sign-up',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
  },
  home: '/',
} as const;