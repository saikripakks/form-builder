import { useSelector, useDispatch } from 'react-redux';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { reorderFields, removeField } from '../store/formSlice';
import { Trash2, GripVertical } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function SortableField({ field, selectedFieldId, onSelectField }) {
  const dispatch = useDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedFieldId === field.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelectField(field.id)}
      className={cn(
        "relative group flex gap-4 p-4 mb-3 rounded-xl border-2 transition-all cursor-pointer bg-white dark:bg-gray-800",
        isSelected 
          ? "border-indigo-500 shadow-md ring-2 ring-indigo-500/20" 
          : "border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm",
        isDragging && "opacity-50 z-50 scale-105 shadow-xl"
      )}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="flex items-center text-gray-400 hover:text-indigo-500 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={20} />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        
        {field.type === 'text' && (
          <input 
            type="text" 
            placeholder={field.placeholder} 
            disabled 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 opacity-70"
          />
        )}
        
        {field.type === 'dropdown' && (
          <select disabled className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 opacity-70">
            {field.options?.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        )}
        
        {field.type === 'checkbox' && (
          <div className="flex flex-col gap-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input type="checkbox" disabled className="rounded text-indigo-600 focus:ring-indigo-500" />
                <span className="text-gray-500 text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )}
        
        {field.type === 'radio' && (
          <div className="flex flex-col gap-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input type="radio" disabled className="text-indigo-600 focus:ring-indigo-500" />
                <span className="text-gray-500 text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(removeField(field.id));
          if (isSelected) onSelectField(null);
        }}
        className={cn(
          "p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100",
          isSelected && "opacity-100 text-red-500"
        )}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default function Canvas({ selectedFieldId, onSelectField }) {
  const fields = useSelector((state) => state.form.fields);
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      const newOrder = arrayMove(fields, oldIndex, newIndex);
      dispatch(reorderFields(newOrder));
    }
  };

  return (
    <div className="flex-1 bg-gray-100/50 dark:bg-gray-900 overflow-y-auto p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        {fields.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800/50">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Your form is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-1">
              Add fields from the left sidebar to get started
            </p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={fields.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="pb-32">
                {fields.map((field) => (
                  <SortableField 
                    key={field.id} 
                    field={field} 
                    selectedFieldId={selectedFieldId}
                    onSelectField={onSelectField}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
