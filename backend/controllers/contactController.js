const Contact = require("../models/Contact");
const AdminNotification = require("../models/AdminNotification");
const nodemailer = require("nodemailer");

// ==========================================
// EMAIL CONFIGURATION
// ==========================================

const isValidEmailConfig = () => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  return Boolean(
    emailUser &&
      emailPass &&
      !emailUser.includes("yourgmail") &&
      !emailPass.includes("your_gmail_app_password")
  );
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ==========================================
// SUBMIT CONTACT FORM
// ==========================================

const submitContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      project,
      subject,
      message,
    } = req.body;

    // Required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, subject and message are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // ==========================================
    // SAVE CONTACT
    // ==========================================

    const contact = await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || "",
      project: project?.trim() || "",
      subject: subject.trim(),
      message: message.trim(),
    });

    try {
      await AdminNotification.create({
        type: "contact",
        referenceId: String(contact._id),
        data: {
          contactId: String(contact._id),
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          project: contact.project,
          subject: contact.subject,
          message: contact.message,
        },
      });
    } catch (notificationError) {
      console.error("Create contact notification failed:", notificationError);
    }

    // ==========================================
    // SEND EMAIL NOTIFICATION
    // ==========================================

    if (isValidEmailConfig()) {
      try {
        await transporter.sendMail({
          from: `"ShopEase Contact Form" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          replyTo: email,

          subject: `New Contact Message: ${subject}`,

          html: `
            <div style="
              font-family: Arial, sans-serif;
              max-width: 650px;
              margin: auto;
              padding: 25px;
              border: 1px solid #ddd;
              border-radius: 12px;
              background: #ffffff;
            ">

              <h2 style="
                color: #4d3d2f;
                border-bottom: 2px solid #c8a279;
                padding-bottom: 10px;
              ">
                New Contact Form Message
              </h2>

              <p>
                You have received a new message
                from your ShopEase website.
              </p>

              <table style="
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              ">

                <tr>
                  <td style="
                    padding: 10px;
                    font-weight: bold;
                  ">
                    Name
                  </td>

                  <td style="padding: 10px;">
                    ${name}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 10px;
                    font-weight: bold;
                  ">
                    Email
                  </td>

                  <td style="padding: 10px;">
                    ${email}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 10px;
                    font-weight: bold;
                  ">
                    Phone
                  </td>

                  <td style="padding: 10px;">
                    ${phone || "Not provided"}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 10px;
                    font-weight: bold;
                  ">
                    Project
                  </td>

                  <td style="padding: 10px;">
                    ${project || "Not provided"}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 10px;
                    font-weight: bold;
                  ">
                    Subject
                  </td>

                  <td style="padding: 10px;">
                    ${subject}
                  </td>
                </tr>

              </table>

              <div style="
                margin-top: 20px;
                padding: 15px;
                background: #faf0e8;
                border-radius: 8px;
              ">

                <strong>Message:</strong>

                <p style="
                  white-space: pre-line;
                  line-height: 1.6;
                ">
                  ${message}
                </p>

              </div>

              <p style="
                margin-top: 25px;
                color: #777;
                font-size: 13px;
              ">
                Contact ID: ${contact._id}
              </p>

            </div>
          `,
        });

      } catch (emailError) {
        console.error(
          "Contact Email Error:",
          emailError.message
        );
      }
    }

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contactId: contact._id,
    });

  } catch (error) {
    console.error(
      "Contact Form Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to submit contact form",
    });
  }
};


// ==========================================
// GET ALL CONTACTS - ADMIN
// ==========================================

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      contacts,
    });

  } catch (error) {
    console.error(
      "Get Contacts Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};


// ==========================================
// DELETE CONTACT - ADMIN
// ==========================================

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required",
      });
    }

    // Find contact first
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Delete contact
    await Contact.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Contact Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  submitContact,
  getContacts,
  deleteContact,
};
