const { sendMail, scheduleSendMail } = require("../config/email");

const sendStudentList = async (req, res) => {
  try {
    await sendMail(); // istek atıldığında doğrudan eposta gönderme işlemi, eğer bu konulmazsa email göndermeye 7 gün sonra başlar.
    scheduleSendMail();

    res.status(200).json({ message: "Successfull", isSuccess: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, isSuccess: false });
  }
};

module.exports = { sendStudentList };
