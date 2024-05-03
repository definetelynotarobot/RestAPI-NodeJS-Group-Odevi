const express = require("express");
const schedule = require('node-schedule');// belirli bir tarih ve saatte veya belirli aralıklarla belirtilen işlevleri çalıştırmanıza olanak tanır.
const { connectDB, disconnectDB, queryDB } = require('./database');
const nodemailer = require('nodemailer');// e-posta göndermek için kullanılan bir kütüphanedir.
const app = express();
const fs = require('fs');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //!gelen isteklerin JSON ve URL kodlu verilerini işlemek için kullanılır.

// Ana sayfa için bir GET isteği işleyicisi
app.get('/', (req, res) => {
    res.send('API\'ya hoş geldiniz'); 
});

// Yeni bir öğrenci eklemek için bir POST isteği işleyicisi
app.post('/students', async (req, res) => {
    const { name, email, deptid} = req.body;
    try {
        // Öğrenci veritabanına ekleme işlemi
        const result = await queryDB(
            'INSERT INTO public."Student" (name, email, deptid) VALUES ($1, $2, $3) RETURNING *',
            [name, email, deptid]
        );
        // Öğrenci sayacını artırma işlemi
        await queryDB('UPDATE "student_counter" SET counter = counter + 1');

        // Başarılı yanıt
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        // Hata durumunda uygun şekilde cevap verme
        console.error('Öğrenci eklenirken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Dahili sunucu hatası' });
    }
});

// Bir öğrenciyi silmek için bir DELETE isteği işleyicisi
app.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        // Öğrenciyi veritabanından silme işlemi
        const result = await queryDB('DELETE FROM public."Student" WHERE id = $1 RETURNING *', [studentId]);
        if (result.rows.length === 0) {
            // Silinen öğrenci bulunamadı durumunda hata yanıtı
            res.status(404).json({ success: false, error: 'Öğrenci bulunamadı' });
        } else {
            // Başarılı yanıt
            res.json({ success: true, message: 'Öğrenci başarıyla silindi' });
        }
    } catch (error) {
        // Hata durumunda uygun şekilde cevap verme
        console.error('Öğrenci silinirken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Dahili sunucu hatası' });
    }
});

// Bir öğrenciyi güncellemek için bir PUT isteği işleyicisi
app.put('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    const { name, email, deptid } = req.body;
    try {
        // Öğrenciyi güncelleme işlemi
        const result = await queryDB('UPDATE public."Student" SET name = $1, email = $2, deptid = $3 WHERE id = $4 RETURNING *', [name, email, deptid, studentId]);

        // Öğrenci sayacını azaltma işlemi
        await queryDB('UPDATE "student_counter" SET counter = counter - 1');

        if (result.rows.length === 0) {
            // Güncellenen öğrenci bulunamadı durumunda hata yanıtı
            res.status(404).json({ success: false, error: 'Öğrenci bulunamadı' });
        } else {
            // Başarılı yanıt
            res.json({ success: true, message: 'Öğrenci başarıyla güncellendi', data: result.rows[0] });
        }
    } catch (error) {
        // Hata durumunda uygun şekilde cevap verme
        console.error('Öğrenci güncellenirken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Dahili sunucu hatası' });
    }
});

// Yeni bir bölüm eklemek için bir POST isteği işleyicisi
app.post('/departments', async (req, res) => {
    const { name, dept_std_id } = req.body;
    try {
        // Bölümü veritabanına ekleme işlemi
        const result = await queryDB(
            'INSERT INTO public."Department" (name, dept_std_id) VALUES ($1, $2) RETURNING *',
            [name, dept_std_id]
        );
        // Başarılı yanıt
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        // Hata durumunda uygun şekilde cevap verme
        console.error('Bölüm eklenirken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Dahili sunucu hatası' });
    }
});

// Bir bölümü silmek için bir DELETE isteği işleyicisi
app.delete('/departments/:id', async (req, res) => {
    const departmentId = req.params.id;
    try {
        // Bölümü veritabanından silme işlemi
        const result = await queryDB('DELETE FROM public."Department" WHERE id = $1 RETURNING *', [departmentId]);
        if (result.rows.length === 0) {
            // Silinen bölüm bulunamadı durumunda hata yanıtı
            res.status(404).json({ success: false, error: 'Bölüm bulunamadı' });
        } else {
            // Başarılı yanıt
            res.json({ success: true, message: 'Bölüm başarıyla silindi' });
        }
    } catch (error) {
        // Hata durumunda uygun şekilde cevap verme
        console.error('Bölüm silinirken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Dahili sunucu hatası' });
    }
});

// Bir bölümü güncellemek için bir PUT isteği işleyicisi
app.put('/departments/:id', async (req, res) => {
    const departmentId = req.params.id;
    const { name, dept_std_id } = req.body;
    try {
        // Bölümü güncelleme işlemi
        const result = await queryDB(
            'UPDATE public."Department" SET name = $1, dept_std_id = $2 WHERE id = $3 RETURNING *',
            [name, dept_std_id, departmentId]
        );
        if (result.rows.length === 0) {
            // Güncellenen bölüm bulunamadı durumunda hata yanıtı
            res.status(404).json({ success: false, error: 'Bölüm bulunamadı' });
        } else {
            // Başarılı yanıt
            res.json({ success: true, data: result.rows[0] });
        }
    } catch (error) {
        // Hata durumunda uygun şekilde cevap verme
        console.error('Bölüm güncellenirken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Dahili sunucu hatası' });
    }
});

// Yedekleme periyodunu belirleme
const PERIOD = process.env.PERIOD || 'haftalık'; // PERIOD değişkenini saatlik olarak güncellendi 

function calculateBackupTime(period) { //Bu fonksiyon, backupTime değişkeninin değerini belirlemek için kullanılıyor ve yedekleme işlemi planlayıcısı (scheduleJob)
    if (period === "dakikalık") {
        // Her dakika
        return '* * * * *';
    } else if (period === "haftalık") {
        // Pazartesi günü saat 10:00
        return '0 10 * * 1';
    } else {
        // Geçersiz periyot
        return null;
    }
}


// Yedekleme zamanını hesaplama
const backupTime = calculateBackupTime(PERIOD);

// Yedekleme işlemini gerçekleştirme
async function createBackup() {
    try {
        // Öğrenci veritabanından bilgileri al ve bir dosyaya yaz
        const queryResult = await queryDB('SELECT * FROM public."Student"');
        const studentList = queryResult.rows;
        fs.writeFileSync('student_backup.json', JSON.stringify(studentList, null, 2));
        console.log('Öğrenci yedekleme dosyası oluşturuldu.');
        // E-posta gönderme fonksiyonunu çağırarak yedeği gönder
        const backupPath = 'student_backup.json'; // Yedek dosyasının yolu
        await sendEmail("Haftalık Yedek Dosyası", "Haftalık yedek dosyası ekte.", backupPath);
    } catch (error) {
        // Hata durumunda uygun şekilde cevap verme
        console.error('Öğrenci yedekleme dosyası oluşturulurken bir hata oluştu:', error);
    }
}

// Yedekleme işlemini belirlenen zaman aralığında gerçekleştirme
schedule.scheduleJob(backupTime, async () => {
    try {
        await createBackup();
    } catch (error) {
        console.error('Yedekleme işlemi sırasında bir hata oluştu:', error);
    }
});

// E-posta gönderme işlemini gerçekleştirme
async function sendEmail(subject, message, attachmentPath) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'x.y@gmail.com', // gönderen e-posta adresi
                pass: '****' // gönderen e-posta şifresi
            }
        });

        const mailOptions = {
            from: 'x.y@gmail.com', // gönderen e-posta adresi
            to: 'a.z@gmail.com', // alıcı e-posta adresi
            subject: subject,
            text: message,
            attachments: [{
                filename: 'student_backup.json',
                path: attachmentPath // ek dosyanın yolu
            }]
        };

        await transporter.sendMail(mailOptions);
        console.log('E-posta başarıyla gönderildi.');
    } catch (error) {
        // Hata durumunda uygun şekilde cevap verme
        console.error('E-posta gönderirken bir hata oluştu:', error);
    }
}

// Veritabanına bağlan ve sunucuyu dinlemeye başla
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Sunucu ${port} portunda çalışıyor...`);
    });
});

// Ctrl+C sinyali alındığında veritabanı bağlantısını kapat ve süreci sonlandır
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});
