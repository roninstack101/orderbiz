import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    },
  });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from:`"OrderBiz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: ` 
        <h2>Password Reset Request</h2> 
        <p>You requested a password reset. Click the link below to reset your password:</p> 
        <a href="${resetUrl}">${resetUrl}</a> 
        <p>This link will expire in 1 hour.</p> 
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from:`"OrderBiz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification OTP",
      html: ` 
        <h2>Email Verification</h2> 
        <p>Your OTP for email verification is: <strong>${otp}</strong></p> 
        <p>This OTP will expire in 10 minutes.</p> 
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from:`"OrderBiz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Our Platform",
      html: ` 
        <h2>Account Created Successfully</h2> 
        <p>Dear ${name}, your account has been created on our platform Orderbiz.</p> 
        <p>To finalize your registration, please follow the below steps:</p> 
        <ul> 
          <li>Login with the Email: ${email}</li> 
          <li>then click on forgot password</li> 
          <li>Set your new password and your account is ready to use.</li>
        </ul>
        <p>Welcome to Orderbiz!</p>
        <br />
        <p><b>Best Regards,</b></p>
        <p><b>Admin</b></p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetConfirmation = async (email) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"OrderBiz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Successful",
      html: ` 
        <h2>Password Reset Successful</h2> 
        <p>Your password has been successfully reset.</p> 
        <p>If you did not request this change, please contact our support team immediately.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Password reset confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending password reset confirmation email:", error);
    throw new Error("Failed to send password reset confirmation email");
  }
};


export const sendShopApprovalEmail = async (email, ownerName, shopName) => {
  try {
    const transporter = createTransporter();
    const loginUrl = `${process.env.FRONTEND_URL}/login`; // Or a direct dashboard link
    const mailOptions = {
      from: `"OrderBiz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Congratulations! Your shop "${shopName}" has been approved`,
      html: ` 
        <h2>Your Shop is Live!</h2> 
        <p>Dear ${ownerName},</p> 
        <p>We are thrilled to inform you that your request to register "<b>${shopName}</b>" on OrderBiz has been approved!</p> 
        <p>You can now log in to your dashboard to add products, manage orders, and start selling.</p>
        <a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Go to Your Dashboard</a>
        <p>Welcome to the OrderBiz community!</p>
        <br />
        <p><b>Best Regards,</b></p>
        <p><b>The OrderBiz Team</b></p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Shop approval email sent successfully");
  } catch (error) {
    console.error("Error sending shop approval email:", error);
    throw new Error("Failed to send shop approval email");
  }
};

export const sendShopRejectionEmail = async (email, ownerName, shopName, reason) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"OrderBiz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Update on your shop request for "${shopName}"`,
      html: ` 
        <h2>Update on Your Shop Registration</h2> 
        <p>Dear ${ownerName},</p> 
        <p>Thank you for your interest in joining OrderBiz. After reviewing your application for "<b>${shopName}</b>", we regret to inform you that we are unable to approve your request at this time.</p> 
        <p><b>Reason for rejection:</b> ${reason || "Does not meet our current platform guidelines."}</p>
        <p>If you believe this was a mistake or would like more information, please don't hesitate to contact our support team.</p>
        <br />
        <p><b>Best Regards,</b></p>
        <p><b>The OrderBiz Team</b></p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Shop rejection email sent successfully");
  } catch (error) {
    console.error("Error sending shop rejection email:", error);
    throw new Error("Failed to send shop rejection email");
  }
};


export const sendShopRequestAcknowledgementEmail = async (email, ownerName, shopName) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"OrderBiz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your OrderBiz Shop Request for "${shopName}" is Under Review`,
      html: `
        <h2>We've Received Your Request!</h2>
        <p>Dear ${ownerName},</p>
        <p>Thank you for submitting your request to register "<b>${shopName}</b>" on the OrderBiz platform. We're excited about the possibility of you joining our community!</p>
        
        <p><b>What happens next?</b></p>
        <p>Our team is now carefully reviewing your application to ensure it meets our platform's standards. This process typically takes <strong>2-3 business days</strong>.</p>
        <p>You will receive another email from us as soon as your shop has been approved or if we require any further information from you.</p>
        <p>There is no further action required from you at this time.</p>
        <br />
        <p><b>Best Regards,</b></p>
        <p><b>The OrderBiz Team</b></p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Shop request acknowledgement email sent successfully");
  } catch (error) {
    console.error("Error sending shop request acknowledgement email:", error);
    throw new Error("Failed to send shop request acknowledgement email");
  }
};