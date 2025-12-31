import { useState, useEffect } from "react";

export default function Header({ onLogout, userName }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-text">Script2Doc</span>
            <span className="logo-dot">.</span>
          </div>
        </div>
        
        <div className="header-right">
          {userName && (
            <div className="user-info">
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              {!isMobile && (
                <span className="user-name">{userName}</span>
              )}
            </div>
          )}
          
          {/* FIXED: Always show "Logout" text, not conditional */}
          <button className="logout-btn" onClick={onLogout}>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}