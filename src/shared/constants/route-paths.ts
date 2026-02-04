const GENERAL_BASE = '/general';
const RECRUITER_BASE = '/recruiter';
const SEEKER_BASE = '/seeker';

export const ROUTE_PATHS = {
  HOME: '/',

  GENERAL: {
    CHAT: {
      INDEX: `${GENERAL_BASE}/chat`,
      DETAIL: (chat_id: string | number) => `/chat/${chat_id}`,
    },
    CREATE_PROFILE: `${GENERAL_BASE}/create-profile`,
    LANDING_PAGE: `${GENERAL_BASE}/landing-page`,
  },

  RECRUITER: {
    DISCOVER: {
      INDEX: `${RECRUITER_BASE}/discover`,
      DETAIL: (candidate_id: string | number) => `/discover/${candidate_id}`,
    },
    HOMEPAGE: `${RECRUITER_BASE}/homepage`,
    JOBS: {
      INDEX: `${RECRUITER_BASE}/jobs`,
      DETAIL: (id: string | number) => `/jobs/${id}`,
    },
  },

  SEEKER: {
    PLACEHOLDER: `${SEEKER_BASE}/placeholder`,
  },

  AUTH: {
    FORGOT_PASSWORD: `${GENERAL_BASE}/forgot-password`,
    LOGIN: `${GENERAL_BASE}/login`,
    REGISTER: `${GENERAL_BASE}/register`,
    PROFILE: `${GENERAL_BASE}/profile`,
    SETTINGS: `${GENERAL_BASE}/settings`,
  },

  // Dynamic Routes
  POSTS: {
    INDEX: '/posts',
    DETAIL: (id: string | number) => `/posts/${id}`,
  },
} as const;

export type AppRoutePaths = typeof ROUTE_PATHS;
