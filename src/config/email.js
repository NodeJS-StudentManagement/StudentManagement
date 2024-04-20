require("dotenv").config();
const { writeFile, writeFileSync } = require("fs");
const { pool } = require("./db");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");

const EMAIL_PERIOD = process.env.EMAIL_PERIOD;

const transporter = nodemailer.createTransport({
  service: "outlook",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_FROM_PASSWORD,
  },
});

const message = {
  from: process.env.EMAIL_FROM,
  to: process.env.EMAIL_TO,
  subject: "Haftalık Öğrenci Listesi",
  text: "Haftalık öğrenci listesi ekte bulunmaktadır",
  attachments: [
    {
      filename: "students.json",
      path: "students.json",
    },
  ],
};

const createStudentListJSONFile = async () => {
  const query = "SELECT * FROM students";
  const filePath = "students.json";
  try {
    const { rows: students } = await pool.query(query); // Öğrenci verilerini çekiyoruz
    const json = JSON.stringify(students, null, 1); // JSON formatına çeviriyoruz. İlk parametre veri, ikinci parametre boşluk sayısı, üçüncü parametre ise satır atlamaları belirtir

    writeFile(filePath, json, { encoding: "utf-8" }, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("JSON dosyası oluşturuldu");
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const sendMail = async () => {
  try {
    await createStudentListJSONFile();
    await transporter.sendMail(message);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { sendMail };
