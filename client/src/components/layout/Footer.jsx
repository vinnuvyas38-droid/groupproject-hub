// components/layout/Footer.jsx
// Application footer with student project credit and helpful links.

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
        <p className="font-medium text-gray-700">GroupProject Hub &bull; Student Team Workspace</p>
        <p className="mt-1">
          Built with MERN Stack (MongoDB, Express, React, Node.js) &bull; Vite & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

