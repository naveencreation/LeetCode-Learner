const fs = require('fs');
const file = 'frontend/src/app/(app)/problems/binary-tree/preorder-inorder-postorder-single-guide/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(/Â·/g, '·');

fs.writeFileSync(file, txt);
