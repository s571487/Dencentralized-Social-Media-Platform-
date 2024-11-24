import React from 'react';

interface NavItemProps {
  icon: string;
  text: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
    }}
  >
    <span>{icon}</span>
    <span
      style={{
        fontWeight: 500,
      }}
    >
      {text}
    </span>
  </div>
);

export default NavItem;