const mongoose = require('mongoose');
const app = require('../server/src/app');

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    cached.promise = mongoose.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = async (req, res) => {
  try {
    await connect();
  } catch (err) {
    console.error('Database connection error:', err);
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
  return app(req, res);
};
