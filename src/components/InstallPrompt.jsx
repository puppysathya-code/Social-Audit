import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the custom install prompt
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleNotNow = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="install-prompt-overlay" style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      width: '90%',
      maxWidth: '400px',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <div style={{
        background: '#0d1f3c',
        color: 'white',
        padding: '24px',
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#f0c060', // Gold color from icon
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 4px 12px rgba(240,192,96,0.3)',
            flexShrink: 0
          }}>
            📜
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', color: '#f0c060' }}>மாண்புமிகு மக்கள்</h3>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4', opacity: 0.9 }}>
              இந்த வெப்செட்டை ஒரு Application ஆக இன்ஸ்டால் செய்து எளிதாக பயன்படுத்தவும்.
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
              Install this website as an application for easy use.
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleNotNow}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '14px 0',
              borderRadius: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Not Now
          </button>
          <button 
            onClick={handleInstallClick}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #f0c060 0%, #c9922a 100%)',
              border: 'none',
              color: '#0d1f3c',
              padding: '14px 0',
              borderRadius: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(240,192,96,0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Install App
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InstallPrompt;
