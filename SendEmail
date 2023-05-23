const nodemailer = require('nodemailer');

/*const transport =  nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2b2d542b2ef050",
    pass: "002981d66b9032"
  }
});*/

const SendEmail = async(email, asunto, mensaje, merror, res) => {
  try {
    let transporter;

    if (email.endsWith('@gmail.com')) {
      // Configuración para Gmail
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'plantuapi@gmail.com',
          pass: 'aurarhgkyclcuieu'
        }
      });
    } else {
      // Proveedor de correo electrónico no compatible
      return false;
    }

    // Configurar el contenido del correo electrónico
    const info = await transporter.sendMail({
      from: 'My App noreply@example.com',
      to: email,
      subject: asunto,
      html: mensaje
    });
    return true;
  } catch (error) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: merror,
    });
  }
}

exports.SendEmail = (email, asunto, mensaje, merror, res) => SendEmail(email, asunto, mensaje, merror, res);