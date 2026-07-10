import { useSelector, useDispatch } from 'react-redux';
import { updateField } from '../store/formSlice';
import { Settings2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PropertiesPanel({ selectedFieldId }) {
  const fields = useSelector((state) => state.form.fields);
  const dispatch = useDispatch();
  
  const field = fields.find((f) => f.id === selectedFieldId);

  if (!field) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
        <Settings2 size={48} className="mb-4 opacity-20" />
        <p>Select a field in the canvas to edit its properties.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(updateField({
      id: field.id,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...field.options];
    newOptions[index] = value;
    dispatch(updateField({ id: field.id, options: newOptions }));
  };

  const handleAddOption = () => {
    dispatch(updateField({ id: field.id, options: [...field.options, `Option ${field.options.length + 1}`] }));
  };

  const handleRemoveOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    dispatch(updateField({ id: field.id, options: newOptions }));
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 relative">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Settings2 size={16} className="text-indigo-500" /> Field Properties
        </h2>
        <p className="text-xs text-gray-500 mt-1 capitalize">Type: {field.type}</p>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
        {/* Label Config */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Label
          </label>
          <input
            type="text"
            name="label"
            value={field.label}
            onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
          />
        </div>

        {/* Placeholder Config */}
        {field.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              name="placeholder"
              value={field.placeholder || ''}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
            />
          </div>
        )}

        {/* Validation Rules */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50 space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Validation Rules</h3>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="required"
                checked={field.required}
                onChange={handleChange}
                className="peer w-5 h-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 dark:border-gray-600 checked:bg-indigo-600 checked:border-indigo-600 transition-all"
              />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors">Required Field</span>
          </label>

          {field.type === 'text' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Length</label>
                <input
                  type="number"
                  name="minLength"
                  value={field.minLength || ''}
                  onChange={handleChange}
                  className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Length</label>
                <input
                  type="number"
                  name="maxLength"
                  value={field.maxLength || ''}
                  onChange={handleChange}
                  className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Options for Choice Fields */}
        {['dropdown', 'checkbox', 'radio'].includes(field.type) && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Options</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {field.options?.map((opt, index) => (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key={index} 
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      disabled={field.options.length <= 1}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button
              onClick={handleAddOption}
              className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-md w-full justify-center transition-colors"
            >
              <Plus size={16} /> Add Option
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
