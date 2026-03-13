export const envConfig = {
    serverURL: process.env.REACT_APP_API_URL,
    /** URL của app Admin - dùng để link từ Dashboard front-end sang Admin (SSO token). */
    adminURL: process.env.REACT_APP_ADMIN_URL || 'http://localhost:3001',
};

export const localStorageConfig = {
    accessToken: 'jwt-access-token',
    refreshToken: 'jwt-refresh-token',
};  