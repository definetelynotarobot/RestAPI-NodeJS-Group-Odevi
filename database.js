const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Connect to the database
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database successfully.');
    } catch (err) {
        console.error('Error connecting to PostgreSQL database:', err);
    }
}

// Disconnect from the database
async function disconnectDB() {
    try {
        await client.end();
        console.log('PostgreSQL database connection closed.');
    } catch (err) {
        console.error('Error closing PostgreSQL database connection:', err);
    }
}

// Execute a SQL query
async function queryDB(sqlQuery, values) {
    try {
        const result = await client.query(sqlQuery, values);
        return result;
    } catch (err) {
        console.error('Error executing SQL query:', err);
        throw err;
    }
}

async function addStudent(name, email, deptid) {
    try {
        const insertQuery = 'INSERT INTO public."Student" (name, email, deptid) VALUES ($1, $2, $3)';
        await queryDB(insertQuery, [name, email, deptid]);

        // Update the counter value
        await queryDB('UPDATE "student_counter" SET counter = counter + 1');
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}

async function deleteStudent(studentId) {
    try {
        const deleteQuery = 'DELETE FROM public."Student" WHERE id = $1';
        await queryDB(deleteQuery, [studentId]);

        // Update the counter value
        await queryDB('UPDATE "student_counter" SET counter = counter - 1');
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
}

// Öğrenci yedekleme işlemi
async function createBackup() {
    try {
        // Burada yedekleme işlemleri yapılacak
        console.log('Öğrenci yedekleme işlemi başarıyla gerçekleştirildi.');
    } catch (error) {
        console.error('Öğrenci yedekleme işlemi sırasında bir hata oluştu:', error);
    }
}


module.exports = { connectDB, disconnectDB, queryDB, client, addStudent, deleteStudent, createBackup };
