import { useState } from 'react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

export default function FormBuilder() {
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar - Add Elements */}
      <Sidebar />
      
      {/* Center Canvas - Form Building Area */}
      <Canvas selectedFieldId={selectedFieldId} onSelectField={setSelectedFieldId} />
      
      {/* Right Sidebar - Properties Panel */}
      <PropertiesPanel selectedFieldId={selectedFieldId} />
    </div>
  );
}
