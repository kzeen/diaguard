import { useState } from 'react';

export default function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b py-4 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{q}</h3>
        <span className="text-primary font-bold">{open ? '–' : '+'}</span>
      </div>
      {open && <p className="mt-2 text-sm text-gray-600">{a}</p>}
    </div>
  );
}