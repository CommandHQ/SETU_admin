/**
 * An array of routes that are accesible to the public
 * There routes do not need authendication
 * @type {string[]}
 */

export const publicRoutes = ["/access-denied", "/", "/privacy", "/terms"];
/**
 * An array of routes that are used for authendication
 * There routes will redirect logged in user to /setting pag
 * @type {string[]}
 */

export const authRoutes = ["/auth/login", "/auth/register"];

/**
 * There routes do not need authendication and dont stop by middleware ever.
 * @type {string}
 */

export const apiAuthPrefix = "/api";
/**
 * Default redirect path after login
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/";

/**
 * An array of routes that are used for authendication
 * There routes will redirect logged in user to /setting page
 * @type {string[]}
 */

/**
 * An array of routes that require authentication
 * These routes will redirect unauthenticated users to the login page
 * @type {string[]}
 */
export const protectedRoutes = [
  "/dashboard",
];