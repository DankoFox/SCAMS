import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                {/* Left Side */}
                <span style={styles.copyright}>
                    Copyright  &copy; {currentYear} ACE-CC07 
                </span>

                {/* Right Side */}
                <div style={styles.rightSection}>
                    <span style={styles.madeBy}>Developed by ACE-CC07</span>
                    <span style={styles.separator}>|</span>
                    <a href="/terms-and-conditions" style={styles.link}>Terms & Conditions</a>
                    <span style={styles.separator}>|</span>
                    <a href="/privacy-policy" style={styles.link}>Privacy Policy</a>

                </div>
            </div>
        </footer>
    );
};

// Basic inline styles
const styles: { [key: string]: React.CSSProperties } = {
    footer: {
        backgroundColor: '#f8f9fa',
        padding: '1rem 0',
        width: '100%',
        boxShadow: '0 4px 4px rgba(0, 0, 0, 0.20)', // change to pages css
    },
    container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1300px', margin: '0 auto', padding: '15px 0 15px 0', fontFamily: "'Andika'" },
    copyright: { fontSize: '1rem', color: '#a4a2be', fontFamily: "'Andika'" },
    rightSection: { display: 'flex', alignItems: 'center', gap: '0.3rem' }, // Use gap for spacing between items
    link: { fontSize: '1rem', color: '#b1aec6', textDecoration: 'underline' }, 
    madeBy: { fontSize: '1rem', color: '#a4a2be' },
    separator: {
        color: '#a4a2be',
        margin: '0px',
        cursor: 'default',
        userSelect: 'none',
    },
};  

export default Footer;