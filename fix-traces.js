const fs = require('fs');
const file = 'frontend/src/app/(app)/problems/binary-tree/preorder-inorder-postorder-single-guide/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

const regex1 = /<div className="space-y-5">\s*\{TRACE_STEPS\.map\(\(step, i\) => \{\s*let badgeColor[\s\S]*?badgeLabel = "Pop"; \}\s*return \(\s*<div key=\{i\} className="flex gap-4">\s*<div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold \$\{badgeColor\}`}>\s*\{badgeLabel\}\s*<\/div>\s*<div>\s*<p className="text-sm font-semibold text-gray-900">\{step\.title\}<\/p>\s*<p className="text-sm text-gray-600 mt-1">\{step\.desc\}<\/p>\s*<\/div>\s*<\/div>\s*\);\s*\}\)\}\s*<\/div>/g;

const replacement1 = `<div className="space-y-4">
                {TRACE_STEPS.map((step, i) => {
                  let badgeColor = "bg-gray-100 text-gray-800";
                  let badgeLabel = "";
                  
                  if (step.badge === "pre") { badgeColor = "bg-blue-100 text-blue-700"; badgeLabel = "Pre ✓"; }
                  if (step.badge === "in") { badgeColor = "bg-emerald-100 text-emerald-700"; badgeLabel = "In ✓"; }
                  if (step.badge === "post") { badgeColor = "bg-orange-100 text-orange-700"; badgeLabel = "Post ✓"; }
                  if (step.badge === "push") { badgeColor = "bg-violet-100 text-violet-700"; badgeLabel = "Push"; }
                  if (step.badge === "pop") { badgeColor = "bg-yellow-100 text-yellow-800"; badgeLabel = "Pop"; }

                  return (
                    <div key={i} className="flex gap-4 items-start">
                      <span className={\`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full \${badgeColor}\`}>
                        {badgeLabel}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 mb-0.5">{step.title}</p>
                        <p className="text-[13px] text-slate-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>`;

txt = txt.replace(regex1, replacement1);


const regex2 = /<div className="space-y-3">\s*\{TRACE_STEPS\.map\(\(step, idx\) => \([\s\S]*?className="text-sm text-gray-600 mt-1">\{step\.desc\}<\/p>\s*<\/div>\s*<\/div>\s*\)\)\}\s*<\/div>/g;

const replacement2 = `<div className="space-y-4">
              {TRACE_STEPS.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span
                    className={\`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full text-center \${step.badge === 'push' ? 'bg-violet-100 text-violet-700' : step.badge === 'pre' ? 'bg-blue-100 text-blue-700' : step.badge === 'in' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}\`}
                  >
                    {step.badge === "push" ? "Push" : step.badge === "pre" ? "Pre ✓" : step.badge === "in" ? "In ✓" : "Post ✓"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 mb-0.5">{step.title}</p>
                    <p className="text-[13px] text-slate-500 leading-relaxed mt-0">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>`;

txt = txt.replace(regex2, replacement2);

fs.writeFileSync(file, txt);
console.log('done!');
