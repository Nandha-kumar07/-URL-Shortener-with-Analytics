const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected!');
  } catch (err) {
    console.log('❌ Failed:', err.message);
  } finally {
    await client.close();
  }
}

run();