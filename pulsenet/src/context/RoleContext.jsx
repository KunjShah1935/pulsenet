import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const ROLES = {
  PATIENT: 'patient',
  NURSE: 'nurse',
  DOCTOR: 'doctor',
  PHARMACY: 'pharmacy',
  LAB: 'lab',
  ADMIN: 'admin',
};

export const ROLE_META = {
  patient: { label: 'Patient', color: 'bg-violet-500', user: 'Aarav Mehta', id: 'PT-20041' },
  nurse: { label: 'Nurse', color: 'bg-teal-500', user: 'Priya Sharma', id: 'NR-3082' },
  doctor: { label: 'Doctor', color: 'bg-pulse-500', user: 'Dr. Rohan Verma', id: 'DR-1045' },
  pharmacy: { label: 'Pharmacy', color: 'bg-amber-500', user: 'Karan Patel', id: 'PH-2031' },
  lab: { label: 'Laboratory', color: 'bg-emerald-500', user: 'Sneha Joshi', id: 'LB-4019' },
  admin: { label: 'Admin', color: 'bg-rose-500', user: 'Vikram Singh', id: 'AD-1001' },
};

export function RoleProvider({ children }) {
  const [role, setRole] = useState(ROLES.ADMIN);
  const [activePage, setActivePage] = useState('dashboard');

  const switchRole = (newRole) => {
    setRole(newRole);
    setActivePage('dashboard');
  };

  return (
    <RoleContext.Provider value={{ role, activePage, setActivePage, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
