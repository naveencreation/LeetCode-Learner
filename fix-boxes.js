const fs = require('fs');
const file = 'frontend/src/app/(app)/problems/binary-tree/preorder-inorder-postorder-single-guide/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

// Replace "01 The core idea" rule box with a polished gradient card
const coreIdeaRegex = /<section>\s*<p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">01[ \S]*?The core idea<\/p>[\s\S]*?<div className="p-4 rounded" style=\{\{background: "#EEEDFE", borderLeft: "3px solid #7F77DD"\}\}>[\s\S]*?<p className="text-lg font-semibold text-gray-900">\s*Every node is visited exactly 3 times\. The state counter decides what to do on each visit\.\s*<\/p>\s*<\/div>\s*<p className="text-sm text-gray-600 mt-3">Every node is visited exactly 3 times\. The state counter decides what to do on each visit\.<\/p>\s*<\/section>/;

const coreIdeaReplacement = `<div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">01 · The core idea</p>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 text-white shadow-lg shadow-violet-500/20">
              <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />
              <div className="relative">
                <p className="text-[18px] leading-relaxed font-semibold tracking-wide mb-2">
                  Every node is visited exactly 3 times. The state counter decides what to do on each visit.
                </p>
                <p className="text-violet-100 text-[14px]">
                  Normally, these need 3 separate DFS passes. This algorithm does all three in one pass.
                </p>
              </div>
            </div>
          </div>`;

txt = txt.replace(coreIdeaRegex, coreIdeaReplacement);

// Replace "02 The Three Traversals Compared" box
const traversalsComparedRegex = /<section>\s*<p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">02[\s\S]*?<p className="text-sm text-gray-600">Normally these need 3 separate DFS passes\. This algorithm does all three in one pass\.<\/p>\s*<\/section>/;

const traversalsComparedReplacement = `<div className="mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">02 · The three traversals compared</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-3">1</div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Preorder</p>
                <p className="font-mono text-[13px] font-medium text-blue-700">[1, 2, 4, 5, 3, 6, 7]</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-3">2</div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Inorder</p>
                <p className="font-mono text-[13px] font-medium text-emerald-700">[4, 2, 5, 1, 6, 3, 7]</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 mb-3">3</div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Postorder</p>
                <p className="font-mono text-[13px] font-medium text-orange-700">[4, 5, 2, 6, 7, 3, 1]</p>
              </div>
            </div>
          </div>`;
          
txt = txt.replace(traversalsComparedRegex, traversalsComparedReplacement);

fs.writeFileSync(file, txt);
console.log("Fixed core idea boxes");
