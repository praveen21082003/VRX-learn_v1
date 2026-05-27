import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function ErrorDropdown() {
  const [openAccordion, setOpenAccordion] = useState(null);

  const accordionData = [
    {
      id: 1,
      title: 'Introduction to Node JS',
      lessons: [
        'Node JS Installation Guide',
        'Kickstart Node JS',
        'NPM Library Installation Guide',
        'Mini Project - Todo Application'
      ]
    },
    {
      id: 2,
      title: 'Introduction to Express JS',
      lessons: [
        'Express Basics',
        'Routing in Express',
        'Middleware in Express'
      ]
    },
    {
      id: 3,
      title: 'Introduction to React JS',
      lessons: [
        'JSX Basics',
        'Components',
        'Props and State'
      ]
    }
  ];

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        Dropdown Implementation Error
      </h1>

      <div className="border rounded-lg overflow-hidden">
        {accordionData.map((item) => (
          <div key={item.id} className="border-b">
            {/* Header */}  
            <div
              onClick={() => toggleAccordion(item.id)}
              className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
            >
              <h2 className="font-semibold">
                {item.title}
              </h2>

              {openAccordion === item.id ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>

            {/* Content */}
            {openAccordion === item.id && (
              <div className="bg-white px-6 py-4">
                <ul className="space-y-2">
                  {item.lessons.map((lesson, index) => (
                    <li
                      key={index}
                      className="text-gray-700 border-b pb-2"
                    >
                      📄 {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ErrorDropdown;