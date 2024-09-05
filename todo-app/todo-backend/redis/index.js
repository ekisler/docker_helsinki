const redis = require('redis');
const { promisify } = require('util');
const { REDIS_URL } = require('../util/config');

console.log('REDIS_URL:', REDIS_URL); // Log para verificar si REDIS_URL está definida

let getAsync;
let setAsync;

if (!REDIS_URL) {
  console.log('No REDIS_URL set, Redis is disabled');
  getAsync = () => Promise.resolve(null);
  setAsync = () => Promise.resolve(true);
} else {
  const client = redis.createClient({
    url: REDIS_URL
  });
  
  client.on('connect', () => {
    console.log('Conectado a Redis');
  });

  getAsync = promisify(client.get).bind(client);
  setAsync = promisify(client.set).bind(client);
}

module.exports = {
  getAsync,
  setAsync
};
