module.exports.sockets = {
  transports: ["websocket"],
  beforeConnect: (_handshake, proceed) => {
    // `true` allows the socket to connect.
    // (`false` would reject the connection)
    return proceed(undefined, true);
  },
  afterDisconnect: (_session, _socket, done) => {
    // By default: do nothing.
    // (but always trigger the callback)
    return done();
  },
};
