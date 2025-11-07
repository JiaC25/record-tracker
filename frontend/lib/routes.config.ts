export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  RECORDS: '/records',

  RECORD_VIEW: (id: string) => `/records/${id}`,
  
  // NOT_FOUND: '/404',
  // SERVER_ERROR: '/500'
};

export const PUBLIC_AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP
];

export const PROTECTED_ROUTES = [
  ROUTES.RECORDS,
];