const fs = require('fs');
const path = 'c:/Coding/Naveen/Personal/Github/Tree/frontend/src/app/page.module.css';
let css = fs.readFileSync(path, 'utf8');
const marker = '@media (prefers-reduced-motion: reduce)';
const idx = css.lastIndexOf(marker);
if (idx !== -1) {
  css = css.substring(0, idx) + marker + ' {\n' +
  '  .stageEdgeActive,\n' +
  '  .carouselStack,\n' +
  '  .tabsGlider,\n' +
  '  .slideTreeSvg,\n' +
  '  .graphMini,\n' +
  '  .dpGridMini,\n' +
  '  .arrayMini {\n' +
  '    animation: none !important;\n' +
  '  }\n\n' +
  '  .learningHeader,\n' +
  '  .learningRows > .learningRow {\n' +
  '    animation: none !important;\n' +
  '    transform: none !important;\n' +
  '    opacity: 1 !important;\n' +
  '  }\n\n' +
  '  .carouselStack {\n' +
  '    transform: none;\n' +
  '  }\n}\n\n';
  fs.writeFileSync(path, css);
}
