module.exports = {
  datastores: {
    default: {
      // url: 'mysql://user:password@host:port/database',
    },
  },

  models: {
    migrate: "safe",
  },
  blueprints: {
    shortcuts: false,
  },

  /***************************************************************************
   *                                                                          *
   * Configure your security settings for production.                         *
   *                                                                          *
   * IMPORTANT:                                                               *
   * If web browsers will be communicating with your app, be sure that        *
   * you have CSRF protection enabled.  To do that, set `csrf: true` over     *
   * in the `config/security.js` file (not here), so that CSRF app can be     *
   * tested with CSRF protection turned on in development mode too.           *
   *                                                                          *
   ***************************************************************************/
  security: {
    cors: {
      // allowOrigins: [
      //   'https://example.com',
      // ]
    },
  },
  session: {
    /***************************************************************************
     *                                                                          *
     * Production session store configuration.                                  *
     *                                                                          *
     * Uncomment the following lines to finish setting up a package called      *
     * "@sailshq/connect-redis" that will use Redis to handle session data.     *
     * This makes your app more scalable by allowing you to share sessions      *
     * across a cluster of multiple Sails/Node.js servers and/or processes.     *
     * (See http://bit.ly/redis-session-config for more info.)                  *
     *                                                                          *
     * > While @sailshq/connect-redis is a popular choice for Sails apps, many  *
     * > other compatible packages (like "connect-mongo") are available on NPM. *
     * > (For a full list, see https://sailsjs.com/plugins/sessions)            *
     *                                                                          *
     ***************************************************************************/
    // adapter: '@sailshq/connect-redis',
    // url: 'redis://user:password@localhost:6379/databasenumber',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_session__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //
    //--------------------------------------------------------------------------

    /***************************************************************************
     *                                                                          *
     * Production configuration for the session ID cookie name.                 *
     *                                                                          *
     * We reccomend prefixing your session cookie with `__Host-`, this limits   *
     * the scope of your cookie to a single origin to protect against same-site *
     * attacks.                                                                 *
     *                                                                          *
     * Note that with the `__Host-` prefix, session cookies will _not_ be sent  *
     * unless `sails.config.cookie.secure` is set to `true`.                    *
     *                                                                          *
     * Read more:                                                               *
     * https://sailsjs.com/config/session#?the-session-id-cookie                *
     *                                                                          *
     ***************************************************************************/
    // name: '__Host-sails.sid',

    /***************************************************************************
     *                                                                          *
     * Production configuration for the session ID cookie.                      *
     *                                                                          *
     * Tell browsers (or other user agents) to ensure that session ID cookies   *
     * are always transmitted via HTTPS, and that they expire 24 hours after    *
     * they are set.                                                            *
     *                                                                          *
     * Note that with `secure: true` set, session cookies will _not_ be         *
     * transmitted over unsecured (HTTP) connections. Also, for apps behind     *
     * proxies (like Heroku), the `trustProxy` setting under `http` must be     *
     * configured in order for `secure: true` to work.                          *
     *                                                                          *
     * > While you might want to increase or decrease the `maxAge` or provide   *
     * > other options, you should always set `secure: true` in production      *
     * > if the app is being served over HTTPS.                                 *
     *                                                                          *
     * Read more:                                                               *
     * https://sailsjs.com/config/session#?the-session-id-cookie                *
     *                                                                          *
     ***************************************************************************/
    cookie: {
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
  sockets: {
    /***************************************************************************
     *                                                                          *
     * Uncomment the `onlyAllowOrigins` whitelist below to configure which      *
     * "origins" are allowed to open socket connections to your Sails app.      *
     *                                                                          *
     * > Replace "https://example.com" etc. with the URL(s) of your app.        *
     * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
     *                                                                          *
     ***************************************************************************/
    // onlyAllowOrigins: [
    //   'https://example.com',
    //   'https://staging.example.com',
    // ],
    /***************************************************************************
     *                                                                          *
     * If you are deploying a cluster of multiple servers and/or processes,     *
     * then uncomment the following lines.  This tells Socket.io about a Redis  *
     * server it can use to help it deliver broadcasted socket messages.        *
     *                                                                          *
     * > Be sure a compatible version of @sailshq/socket.io-redis is installed! *
     * > (See https://sailsjs.com/config/sockets for the latest version info)   *
     *                                                                          *
     * (https://sailsjs.com/docs/concepts/deployment/scaling)                   *
     *                                                                          *
     ***************************************************************************/
    // adapter: '@sailshq/socket.io-redis',
    // url: 'redis://user:password@bigsquid.redistogo.com:9562/databasenumber',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_sockets__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //--------------------------------------------------------------------------
  },

  log: {
    level: "debug",
  },

  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000,
    // trustProxy: true,
  },
  port: 35353,

  custom: {
    baseUrl: "https://example.com",
    internalEmailAddress: "support@example.com",
  },
};
