export const ApiRoutes = {
  logout: '/auth/jwt/logout',
  login: '/auth/jwt/create',
  refresh: '/auth/jwt/refresh',
  me: '/users/me',
  users: '/users/',
  startRegistration: '/users/register/start',
  finishRegistration: '/users/register/finish',
  startAuthentication: '/auth/login/initiate',
  finishAuthentication: '/auth/login/complete',
} as const;
