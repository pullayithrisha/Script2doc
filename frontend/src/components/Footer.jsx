import React from "react";
import "../index.css";

export default function Footer() {
  const handleEmailClick = () => {
    const email = "pullaythrisha@gmail.com";
    const subject = "Script2Doc Query";
    const body = "Hello,\n\nI would like to inquire about...";

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const opened = window.open(gmailUrl, "_blank");
    if (!opened) window.location.href = mailtoUrl;
  };

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-link email-link" onClick={handleEmailClick}>
            Contact: pullaythrisha@gmail.com
          </span>
        </div>
        <div className="footer-right">
          <p>© {new Date().getFullYear()} Script2Doc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
