// components/layout/Navbar.jsx
// Main navigation header with responsive hamburger menu on small screens
// and an inline project switcher indicating the active workspace.

import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import ProjectSwitcher from './ProjectSwitcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { project } = useProject();

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/projects', label: 'Projects' },
    { to: '/members', label: 'Members' },
    { to: '/tasks', label: 'Tasks' },
    { to: '/notes', label: 'Notes' },
    { to: '/milestones', label: 'Milestones' },
    { to: '/summary', label: 'Member Summary', highlight: true },
  ];

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-700 text-white'
        : 'text-blue-100 hover:bg-blue-600 hover:text-white'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? 'bg-blue-700 text-white'
        : 'text-blue-100 hover:bg-blue-600 hover:text-white'
    }`;

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="text-2xl" aria-hidden="true">🎓</span>
              <span>GroupProject Hub</span>
            </Link>

            {/* Desktop Project switcher dropdown */}
            <div className="hidden md:block ml-4">
              <ProjectSwitcher />
            </div>
          </div>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-blue-700 border-t border-blue-500">
          <div className="px-3 py-2">
            <ProjectSwitcher />
          </div>
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={mobileLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

