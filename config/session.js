/**
 * Session
 * 
 * Sails session integration leans heavily on the great work already done by Express, but also unifies 
 * Socket.io with the Connect session store. It uses Connect's cookie parser to normalize configuration
 * differences between Express and Socket.io and hooks into Sails' middleware interpreter to allow you
 * to access and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#documentation
 */
/*global process*/
module.exports.session = {
  secret: 'e74596c900870af2b1092ec2c2d4661c',
  adapter: 'redis',
  host: process.env.OPENSHIFT_REDIS_HOST || 'localhost',
  pass: process.env.REDIS_PASSWORD || 'test',
  port: process.env.OPENSHIFT_REDIS_PORT || 6379,
  prefix: 'sess:',
  ttl: 60*60*48, // 2 days
  db: 0
};
