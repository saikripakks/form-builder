import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function FormPreview() {
  const fields = useSelector((state) => state.form.fields);
  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const onSubmit = (data) => {
    console.log('Form Submitted Data:', data);
    setSubmittedData(data);
    setIsSubmitted(true);
    reset();
    
    // Reset submission state after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setSubmittedData(null);
    }, 5000);
  };

  if (fields.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">Nothing to preview!</h2>
          <p className="text-gray-500 mt-2">Go back to the builder and add some fields.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto p-8 flex justify-center relative">
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-8 w-full max-w-md z-50 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl shadow-lg"
          >
            <CheckCircle2 size={24} />
            <div>
              <p className="font-medium">Form submitted successfully!</p>
              <p className="text-sm opacity-80">Check the console for the data.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl mt-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Preview Your Form</h2>
            <p className="text-gray-500 mt-1 text-sm">Fill out the fields below and submit to test validations.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field) => {
              const rules = {
                required: field.required ? 'This field is required' : false,
              };
              if (field.type === 'text') {
                if (field.minLength) rules.minLength = { value: parseInt(field.minLength), message: `Minimum length is ${field.minLength}` };
                if (field.maxLength) rules.maxLength = { value: parseInt(field.maxLength), message: `Maximum length is ${field.maxLength}` };
              }

              return (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>

                  <Controller
                    name={field.id}
                    control={control}
                    rules={rules}
                    defaultValue={field.type === 'checkbox' ? [] : ''}
                    render={({ field: controllerField }) => {
                      if (field.type === 'text') {
                        return (
                          <input
                            {...controllerField}
                            type="text"
                            placeholder={field.placeholder}
                            className={`w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow ${
                              errors[field.id] 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
                            }`}
                          />
                        );
                      }

                      if (field.type === 'dropdown') {
                        return (
                          <div className="relative">
                            <select
                              {...controllerField}
                              className={`w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow appearance-none ${
                                errors[field.id] ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <option value="">Select an option</option>
                              {field.options?.map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                          </div>
                        );
                      }

                      if (field.type === 'checkbox') {
                        return (
                          <div className="flex flex-col gap-3 mt-2">
                            {field.options?.map((opt, i) => (
                              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                  <input
                                    type="checkbox"
                                    value={opt}
                                    checked={controllerField.value?.includes(opt)}
                                    onChange={(e) => {
                                      const val = controllerField.value || [];
                                      if (e.target.checked) {
                                        controllerField.onChange([...val, opt]);
                                      } else {
                                        controllerField.onChange(val.filter((v) => v !== opt));
                                      }
                                    }}
                                    className="peer w-5 h-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 dark:border-gray-600 checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                                  />
                                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors">{opt}</span>
                              </label>
                            ))}
                          </div>
                        );
                      }

                      if (field.type === 'radio') {
                        return (
                          <div className="flex flex-col gap-3 mt-2">
                            {field.options?.map((opt, i) => (
                              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                  <input
                                    type="radio"
                                    value={opt}
                                    checked={controllerField.value === opt}
                                    onChange={() => controllerField.onChange(opt)}
                                    className="peer w-5 h-5 cursor-pointer appearance-none rounded-full border-2 border-gray-300 dark:border-gray-600 checked:border-indigo-600 transition-all"
                                  />
                                  <div className="absolute w-2.5 h-2.5 bg-indigo-600 rounded-full opacity-0 peer-checked:opacity-100 left-[5px] top-[5px] scale-50 peer-checked:scale-100 transition-all duration-200"></div>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors">{opt}</span>
                              </label>
                            ))}
                          </div>
                        );
                      }
                      
                      return null;
                    }}
                  />
                  {errors[field.id] && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-500 text-xs font-medium mt-1"
                    >
                      {errors[field.id].message}
                    </motion.span>
                  )}
                </div>
              );
            })}
            
            <div className="pt-6 mt-8 border-t border-gray-100 dark:border-gray-700">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Send size={18} /> Submit Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
