-- Öğrenci tablosu
CREATE TABLE IF NOT EXISTS public."Student" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "deptid" INT NOT NULL,
    "counter" INT DEFAULT 0
);

-- Öğrenci_Bölüm ilişki tablosu
CREATE TABLE IF NOT EXISTS public."Student_Department" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT REFERENCES public."Student" ("id"),
    "dept_id" INT REFERENCES public."Department" ("id")
);

-- Bölüm tablosu
CREATE TABLE IF NOT EXISTS public."Department" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "dept_std_id" INT NOT NULL
);
