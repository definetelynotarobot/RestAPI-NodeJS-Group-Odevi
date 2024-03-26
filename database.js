const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Veritabanı aç
async function connectDB() {
    try {
        await client.connect();
        console.log('PostgreSQL veritabanına başarıyla bağlanıldı.');
    } catch (err) {
        console.error('PostgreSQL veritabanına bağlanırken hata oluştu:', err);
    }
}

// Veritabanı kapat
async function disconnectDB() {
    try {
        await client.end();
        console.log('PostgreSQL veritabanı bağlantısı kapatıldı.');
    } catch (err) {
        console.error('PostgreSQL veritabanı bağlantısını kapatırken hata oluştu:', err);
    }
}
async function queryDB(sqlQuery, values) {
    try {
        const result = await client.query(sqlQuery, values);
        return result;
    } catch (err) {
        console.error('Error executing SQL query:', err);
        throw err;
    }
}

module.exports = { connectDB, disconnectDB, queryDB, client }; 


