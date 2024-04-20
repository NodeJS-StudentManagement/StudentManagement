const { sendMail } = require("../config/email");

const sendStudentList = async (req, res) => {
  try {
    await sendMail();
    console.log("Eposta gönderildi");
    res.status(200).json({ message: "Successfull", isSuccess: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, isSuccess: false });
  }
};

module.exports = { sendStudentList };
