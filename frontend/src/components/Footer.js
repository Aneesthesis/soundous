import React from "react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center w-full">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Soundous</p>
        <div className="mt-2">
          <a href="#" className="text-amber-400 hover:text-amber-600 mx-2">
            Terms of Service
          </a>
          <span className="mx-2">|</span>
          <a href="#" className="text-amber-400 hover:text-amber-600 mx-2">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
