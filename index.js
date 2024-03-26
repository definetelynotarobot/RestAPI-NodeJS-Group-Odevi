const express = require("express");
const { connectDB, disconnectDB, queryDB } = require('./database');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

// URL-kodlanmış gövdeleri ayrıştırmak için ara yazılım
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API\'ya hoş geldiniz'); // Hoş geldiniz mesajı gönder
});

// Bir öğrenci eklemek için rota
app.post('/students', async (req, res) => {
    const { name, email, deptid, counter } = req.body;
    try {
        const result = await queryDB(
            'INSERT INTO public."Student" (name, email, deptid, counter) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, deptid, counter]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Öğrenci eklenirken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Dahili sunucu hatası' });
    }
});

// Bir öğrenciyi ID'ye göre silmek için rota
app.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const result = await queryDB('DELETE FROM public."Student" WHERE id = $1 RETURNING *', [studentId]);
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, error: 'Öğrenci bulunamadı' });
        } else {
            res.json({ success: true, message: 'Öğrenci başarıyla silindi' });
        }
    } catch (error) {
        console.error('Öğrenci silinirken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Dahili sunucu hatası' });
    }
});
app.put('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    const { name, email, deptid } = req.body;
    try {
        const result = await queryDB('UPDATE public."Student" SET name = $1, email = $2, deptid = $3 WHERE id = $4 RETURNING *', [name, email, deptid, studentId]);
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, error: 'Student not found' });
        } else {
            res.json({ success: true, message: 'Student updated successfully', data: result.rows[0] });
        }
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Sunucu ${port} portunda çalışıyor...`);
    });
});

// Zarif kapatma
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});
