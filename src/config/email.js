require("dotenv").config();
const fs = require("fs");
const { pool } = require("./db");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");

var json;

const createStudentListJSONFile = async () => {
  const query = "SELECT * FROM students";
  const filePath = "students.json";
  try {
    const { rows: students } = await pool.query(query); // Öğrenci verilerini çekiyoruz
    json = JSON.stringify(students, null, 1); // JSON formatına çeviriyoruz. İlk parametre veri, ikinci parametre boşluk sayısı, üçüncü parametre ise satır atlamaları belirtir

    fs.writeFile(filePath, json, { encoding: "utf-8" }, (err) => {
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

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_FROM_PASSWORD,
  },
});

const sendMail = async () => {
  const filePath = "./students.json";
  try {
    await createStudentListJSONFile();

    const messageConfig = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "Haftalık Öğrenci Listesi",
      text: `Haftalık öğrenci listesi ekte bulunmaktadır veya aşağıdan kolayca erişebilirsiniz. \n \n Students: \n ${json}`,
      attachments: [
        {
          path: filePath,
          filename: "students.json",
        },
      ],
    };

    await transporter.sendMail(messageConfig);
    console.log("Mail gönderildi");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const scheduleSendMail = () => {
  schedule.scheduleJob(process.env.EMAIL_PERIOD || "", async () => {
    // process.env.EMAIL_PERIOD değeri .env dosyasında belirtilen süre aralığında mail gönderme işlemi gerçekleşir.
    // Şu andaki veriye göre her çarşamba saat 9'da mail gönderme işlemi gerçekleşir
    try {
      await sendMail();
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = { sendMail, scheduleSendMail };
