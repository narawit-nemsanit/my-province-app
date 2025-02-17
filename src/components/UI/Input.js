// src/components/ui/input.js

export function Input({ className, ...props }) {
    return (
      <input
        type="text"
        className={`border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        {...props}
      />
    );
  }
  