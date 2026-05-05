const nodemailer = require("nodemailer");

exports.sendContactMail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
      }
    });

    // Verify connection configuration
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      replyTo: email,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message from ${name} - Food Waste System`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 5px solid #4CAF50;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `
    });

    res.json({ message: "Email sent successfully" });

  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ 
      error: "Failed to send email", 
      details: error.message 
    });
  }
};

