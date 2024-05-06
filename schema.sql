-- Öğrenci tablosu
CREATE TABLE IF NOT EXISTS public."Student" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "deptid" INT NOT NULL,
    "address" VARCHAR(255), -- Adres sütunu ekleniyor
    "phone" VARCHAR(15), -- Telefon sütunu ekleniyor
    "clubs" VARCHAR(255)[] -- Kulüpler sütunu ekleniyor (dizi türünde)
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Bölüm tablosu
CREATE TABLE IF NOT EXISTS public."Department" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "dept_std_id" INT NOT NULL,
    "head_of_department" VARCHAR(255), -- Bölüm başkanının adı veya kimliği
    "head_email" VARCHAR(255), -- Bölüm başkanının e-posta adresi
    "quota" INT NOT NULL -- Bölüm kontenjanı
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Öğrenci_Bölüm ilişki tablosu
CREATE TABLE IF NOT EXISTS public."Student_Department" (
    "id" SERIAL PRIMARY KEY,
    "student_id" INT REFERENCES public."Student" ("id"),
    "dept_id" INT REFERENCES public."Department" ("id")
);


CREATE TABLE IF NOT EXISTS public."student_counter" (
    "counter" INT DEFAULT 0
);
