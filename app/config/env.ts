// ─── Context Engine App Configuration ───

export const ENV = {
  // Production FastAPI Backend
  API_BASE_URL: 'https://context-engine-seven.vercel.app/api/v1',
  
  // Timeout for HTTP requests (ms)
  API_TIMEOUT_MS: 20000,

  // App details
  APP_NAME: 'Context Engine',
  APP_VERSION: '1.0.0',
};

export default ENV;
