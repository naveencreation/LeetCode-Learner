const fs = require('fs');
const file = 'frontend/src/app/(app)/problems/binary-tree/preorder-inorder-postorder-single-guide/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

// The mode toggler
txt = txt.replace(/<div className="flex bg-gray-100 p-1 rounded-md mb-6 inline-flex">/, '<div className="flex bg-slate-100/80 p-1 rounded-xl mb-6 inline-flex border border-slate-200">');
txt = txt.replace(/<button\s*onClick=\{\(\) => setMode\('text'\)\}\s*className=\{`px-4 py-2 text-sm font-medium rounded-sm \$\{mode === 'text' \? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`\}\s*>/, 
    '<button onClick={() => setMode(\'text\')} className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors ${mode === \'text\' ? \'bg-white text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50\' : \'text-slate-500 hover:text-slate-700 hover:bg-slate-50\'}`}>');
txt = txt.replace(/<button\s*onClick=\{\(\) => setMode\('code'\)\}\s*className=\{`px-4 py-2 text-sm font-medium rounded-sm \$\{mode === 'code' \? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`\}\s*>/,
    '<button onClick={() => setMode(\'code\')} className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors ${mode === \'code\' ? \'bg-white text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50\' : \'text-slate-500 hover:text-slate-700 hover:bg-slate-50\'}`}>');


// All HR tags
txt = txt.replace(/<hr className="border-gray-200 my-8"\s*\/>/g, '<hr className="border-t border-slate-200 mb-8" />');

// H2s inside mode 'text' if any
txt = txt.replace(/<h2 className="text-xl font-semibold mb-4 text-gray-900">Wait, why are there 3 numbers in every node\?<\/h2>/, '<h2 className="text-lg font-semibold mb-4 text-slate-900">Wait, why are there 3 numbers in every node?</h2>');

// Normal headers
txt = txt.replace(/<p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">(\d+ [^<]+)<\/p>/g, '<p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">$1</p>');
txt = txt.replace(/<p className="text-lg font-semibold text-gray-900">([^<]+)<\/p>/g, '<p className="text-[14px] font-semibold text-slate-900 mb-2">$1</p>');
txt = txt.replace(/<p className="text-sm text-gray-600">/g, '<p className="text-[14px] leading-relaxed text-slate-700">');

// List styles
txt = txt.replace(/<ul className="list-disc pl-5 mt-2 space-y-1 mb-4 text-sm text-gray-700">/g, '<ul className="list-disc pl-5 mt-2 space-y-1 mb-4 text-[14px] text-slate-700">');
txt = txt.replace(/<li className="text-sm text-gray-700 mb-2">/g, '<li className="text-[14px] text-slate-700 mb-2">');
txt = txt.replace(/<code className="bg-gray-100 px-1 py-0\.5 rounded text-gray-800 font-mono text-xs">/g, '<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[13px]">');
txt = txt.replace(/<span className="font-semibold text-gray-900">/g, '<span className="font-semibold text-slate-900">');

fs.writeFileSync(file, txt);
