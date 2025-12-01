import React, { useState } from 'react';
import { Sparkles, Code, FileCode, Layers } from 'lucide-react';
// This import expects you to have the index.css file in the same folder
import './index.css';

function App() {
const [activeTab, setActiveTab] = useState('preview');

return (
<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">

  <main className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
    
    {/* Header */}
    <header className="bg-white border-b border-slate-100 p-8 text-center">
      <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
        <Sparkles className="w-8 h-8 text-blue-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        React Single-File Structure
      </h1>
      <p className="text-slate-500 max-w-lg mx-auto">
        This example demonstrates how we combine logic and styles for the preview environment, while keeping them logically distinct for easy export.
      </p>
    </header>

    {/* Content Area */}
    <div className="p-8 bg-slate-50/50">
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Logic Card */}
        <div className="card-hover bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <Code className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">App.js Logic</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Your React components, hooks (<code>useState</code>), and JSX structure live here. In this file, it's the <code>App</code> function and any sub-components.
          </p>
          <div className="bg-slate-900 rounded-md p-3">
            <code className="text-xs text-indigo-300 font-mono">
              function App() &#123; ... &#125;
            </code>
          </div>
        </div>

        {/* Style Card */}
        <div className="card-hover bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-pink-100 rounded-lg mr-3">
              <Layers className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Index.css Styles</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Standard CSS and global styles are injected via a <code>&lt;style&gt;</code> tag or component (like <code>GlobalStyles</code> above) to ensure they render correctly in the preview.
          </p>
          <div className="bg-slate-900 rounded-md p-3">
            <code className="text-xs text-pink-300 font-mono">
              .card-hover &#123; transition: ... &#125;
            </code>
          </div>
        </div>

      </div>
    </div>

    {/* Footer info */}
    <div className="bg-white border-t border-slate-100 p-6">
        <div className="flex items-start gap-3 text-sm text-slate-500 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <FileCode className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
                <span className="font-semibold text-blue-700">Export Tip:</span> When moving this to your local machine, simply copy the CSS content into <code>index.css</code> and the Component logic into <code>App.js</code>.
            </div>
        </div>
    </div>

  </main>
</div>


);
}

export default App;