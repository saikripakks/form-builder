import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addField } from '../store/formSlice';
import { Type, ChevronDown, CheckSquare, CircleDot } from 'lucide-react';
import { motion } from 'framer-motion';

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: <Type size={20} /> },
  { type: 'dropdown', label: 'Dropdown', icon: <ChevronDown size={20} /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={20} /> },
  { type: 'radio', label: 'Radio Buttons', icon: <CircleDot size={20} /> },
];

export default function Sidebar() {
  const dispatch = useDispatch();

  const handleAddField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      placeholder: '',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'], // Default options for choice fields
      minLength: '',
      maxLength: '',
    };
    dispatch(addField(newField));
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Form Elements
      </h2>
      <div className="flex flex-col gap-2">
        {fieldTypes.map((item) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={item.type}
            onClick={() => handleAddField(item.type)}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-sm transition-all text-left group"
          >
            <div className="text-gray-400 group-hover:text-indigo-500 transition-colors">
              {item.icon}
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-auto">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <p className="text-xs text-indigo-800 dark:text-indigo-300">
            Click on an element to add it to your form. Then select it in the canvas to edit its properties.
          </p>
        </div>
      </div>
    </div>
  );
}
