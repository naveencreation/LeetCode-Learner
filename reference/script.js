// ============================================
// TREE NODE CLASS & TREE CREATION
// ============================================

class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// Create the sample tree from your diagram
function createSampleTree() {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.right = new TreeNode(6);
    return root;
}

// ============================================
// CALL STACK FRAME TRACKING
// ============================================

class CallStackFrame {
    constructor(nodeVal, depth, id) {
        this.nodeVal = nodeVal;
        this.depth = depth;
        this.id = id;
        this.state = 'pending'; // pending, executing, returned
        this.children = [];
        this.parent = null;
    }
}

// ============================================
// TRAVERSAL LOGIC WITH CALL STACK
// ============================================

let root = createSampleTree();
let result = [];
let currentStep = 0;
let executionSteps = [];
let callStackHistory = [];
let currentNode = null;
let visitedNodes = new Set();
let nodeStates = {}; // Track state of each node: unvisited, exploring_left, current, exploring_right, completed
let nodePositions = {}; // Store positions of nodes for path drawing
let traversalPath = []; // Track the path of traversal for visualization
let frameCounter = 0;

class ExecutionStep {
    constructor(type, node, operation, callStack = [], nodeStates = {}) {
        this.type = type;
        this.node = node;
        this.value = node?.val;
        this.operation = operation;
        this.callStack = JSON.parse(JSON.stringify(callStack)); // Deep copy
        this.nodeStates = JSON.parse(JSON.stringify(nodeStates)); // Deep copy
    }
}

function generateExecutionSteps() {
    executionSteps = [];
    result = [];
    visitedNodes = new Set();
    callStackHistory = [];
    nodeStates = {};
    currentStep = 0;
    currentNode = null;
    frameCounter = 0;
    
    // Initialize all node states to 'unvisited'
    initializeNodeStates(root);
    
    inorderTraversalWithCallStack(root, 0);
    document.getElementById('stepIndicator').textContent = `0/${executionSteps.length}`;
}

function initializeNodeStates(node) {
    if (node === null) return;
    nodeStates[node.val] = 'unvisited';
    initializeNodeStates(node.left);
    initializeNodeStates(node.right);
}

function inorderTraversalWithCallStack(node, depth = 0) {
    if (node === null) {
        return;
    }

    const frameId = frameCounter++;
    const frame = new CallStackFrame(node.val, depth, frameId);
    callStackHistory.push(frame);
    
    // Record: entering function
    nodeStates[node.val] = 'exploring_left';
    executionSteps.push(new ExecutionStep(
        'enter_function',
        node,
        `Enter: inorder(node=${node.val})`,
        getCallStackSnapshot('executing', frameId),
        JSON.parse(JSON.stringify(nodeStates))
    ));

    // Traverse left
    if (node.left) {
        executionSteps.push(new ExecutionStep(
            'traverse_left', 
            node, 
            `Traverse left from node ${node.val}`,
            getCallStackSnapshot('executing', frameId),
            JSON.parse(JSON.stringify(nodeStates))
        ));
        inorderTraversalWithCallStack(node.left, depth + 1);
    }

    // Process current node
    nodeStates[node.val] = 'current';
    executionSteps.push(new ExecutionStep(
        'visit', 
        node, 
        `Process node ${node.val}`,
        getCallStackSnapshot('executing', frameId),
        JSON.parse(JSON.stringify(nodeStates))
    ));

    // Transition to exploring right
    nodeStates[node.val] = 'exploring_right';
    
    // Traverse right
    if (node.right) {
        executionSteps.push(new ExecutionStep(
            'traverse_right', 
            node, 
            `Traverse right from node ${node.val}`,
            getCallStackSnapshot('executing', frameId),
            JSON.parse(JSON.stringify(nodeStates))
        ));
        inorderTraversalWithCallStack(node.right, depth + 1);
    }

    // Record: exiting function
    nodeStates[node.val] = 'completed';
    executionSteps.push(new ExecutionStep(
        'exit_function',
        node,
        `Return from inorder(node=${node.val})`,
        getCallStackSnapshot('exiting', frameId),
        JSON.parse(JSON.stringify(nodeStates))
    ));
    
    callStackHistory.pop();
}

function getCallStackSnapshot(state, executingFrameId) {
    return callStackHistory.map(frame => ({
        nodeVal: frame.nodeVal,
        depth: frame.depth,
        id: frame.id,
        state: frame.id === executingFrameId ? 'executing' : (state === 'exiting' ? 'returned' : 'pending')
    }));
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function nextStep() {
    if (currentStep < executionSteps.length) {
        const step = executionSteps[currentStep];
        
        // Update node states from step
        nodeStates = JSON.parse(JSON.stringify(step.nodeStates));
        
        if (step.type === 'visit') {
            visitedNodes.add(step.value);
            result.push(step.value);
            currentNode = step.value;
        } else if (step.type === 'traverse_left' || step.type === 'traverse_right' || step.type === 'enter_function') {
            currentNode = step.value;
        }
        
        currentStep++;
        updateUI();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        const step = executionSteps[currentStep];
        
        // Restore node states from step
        nodeStates = JSON.parse(JSON.stringify(step.nodeStates));
        
        if (step.type === 'visit') {
            result.pop();
            visitedNodes.delete(step.value);
        }
        
        currentNode = currentStep > 0 ? executionSteps[currentStep - 1].node?.val : null;
        updateUI();
    }
}

function resetTraversal() {
    currentStep = 0;
    result = [];
    currentNode = null;
    visitedNodes = new Set();
    updateUI();
}

// ============================================
// STEP EXPLANATION GENERATION
// ============================================

function getStepExplanation(stepType, nodeVal, depth) {
    const explanations = {
        'enter_function': {
            title: `📥 Entering inorder(${nodeVal})`,
            description: `Function called for node ${nodeVal}. This creates a new stack frame to process this node and its subtrees.`,
            details: [
                `Node: ${nodeVal}`,
                `Recursion Depth: ${depth}`,
                `Next: Explore left subtree first`
            ]
        },
        'traverse_left': {
            title: `⬅️ Traverse Left from Node ${nodeVal}`,
            description: `Following the Left-Root-Right pattern, we first recursively explore the left subtree to visit all nodes smaller than the current node.`,
            details: [
                `Current Node: ${nodeVal}`,
                `Action: Recursively call inorder(left)`,
                `Purpose: Process all nodes in left subtree before this node`
            ]
        },
        'visit': {
            title: `✏️ Process Node ${nodeVal}`,
            description: `After exploring the left subtree completely, we now process the current node by adding it to our result array. This is the "R" (root) in Left-Root-Right.`,
            details: [
                `Current Node: ${nodeVal}`,
                `Action: Append ${nodeVal} to result array`,
                `Array Position: Element #${result.length + 1}`
            ]
        },
        'traverse_right': {
            title: `➡️ Traverse Right from Node ${nodeVal}`,
            description: `Finally, we explore the right subtree to process all nodes larger than the current node, maintaining the sorted order of inorder traversal.`,
            details: [
                `Current Node: ${nodeVal}`,
                `Action: Recursively call inorder(right)`,
                `Purpose: Process all nodes in right subtree after this node`
            ]
        },
        'exit_function': {
            title: `📤 Returning from inorder(${nodeVal})`,
            description: `Node ${nodeVal} and all its descendants have been processed. We return from this function call and continue with the previous level's right subtree.`,
            details: [
                `Node: ${nodeVal} (Complete ✓)`,
                `Recursion Depth: ${depth}`,
                `Next: Continue with sibling or parent's next operation`
            ]
        }
    };
    
    return explanations[stepType] || {
        title: 'Ready',
        description: 'Click Next to begin traversal',
        details: []
    };
}

function updateExplanation() {
    const container = document.getElementById('explanationBox');
    const titleElem = document.getElementById('explanationTitle');
    const descElem = document.getElementById('explanationDesc');
    const detailsElem = document.getElementById('explanationDetails');
    
    if (currentStep === 0) {
        titleElem.textContent = '🎯 Ready to Start';
        descElem.textContent = 'Click "Next Step" to begin exploring the inorder traversal algorithm. Watch how the recursion unfolds!';
        detailsElem.innerHTML = '<div class="explanation-detail-item">In-order traversal visits nodes in order: Left → Root → Right</div>';
        return;
    }
    
    if (currentStep === executionSteps.length) {
        titleElem.textContent = '🎉 Traversal Complete!';
        descElem.textContent = `Successfully traversed all nodes in inorder! The result array contains all values in ascending order: [${result.join(', ')}]`;
        detailsElem.innerHTML = '<div class="explanation-detail-item">Total steps taken: ' + executionSteps.length + '</div>';
        return;
    }
    
    const currentExecution = executionSteps[currentStep - 1];
    const explanation = getStepExplanation(
        currentExecution.type, 
        currentExecution.value,
        currentExecution.callStack ? currentExecution.callStack[currentExecution.callStack.length - 1]?.depth || 0 : 0
    );
    
    titleElem.textContent = explanation.title;
    descElem.textContent = explanation.description;
    
    detailsElem.innerHTML = explanation.details
        .map(detail => `<div class="explanation-detail-item">${detail}</div>`)
        .join('');
}

// ============================================
// UI UPDATE FUNCTION
// ============================================

function updateUI() {
    // Update indicators
    document.getElementById('stepIndicator').textContent = `${currentStep}/${executionSteps.length}`;
    document.getElementById('currentNode').textContent = currentNode !== null ? currentNode : '-';
    document.getElementById('visitedCount').textContent = String(result.length);
    document.getElementById('resultPreview').textContent = `[${result.join(', ')}]`;
    
    // Determine current operation phase and code line
    let phase = 'Complete';
    let codeLine = -1;
    
    if (currentStep < executionSteps.length) {
        const nextOp = executionSteps[currentStep];
        if (nextOp.type === 'traverse_left') {
            phase = 'Traverse Left';
            codeLine = 3;
        } else if (nextOp.type === 'traverse_right') {
            phase = 'Traverse Right';
            codeLine = 5;
        } else if (nextOp.type === 'visit') {
            phase = 'Process Node';
            codeLine = 4;
        } else if (nextOp.type === 'enter_function') {
            phase = 'Enter Function';
            codeLine = 0;
        } else if (nextOp.type === 'exit_function') {
            phase = 'Exit Function';
            codeLine = 2;
        }
    }
    
    document.getElementById('phase').textContent = phase;
    
    // Update code line highlighting
    updateCodeHighlight(codeLine);
    
    // Update operation badge
    const badge = document.getElementById('operationBadge');
    if (currentStep < executionSteps.length) {
        const op = executionSteps[currentStep].operation;
        badge.textContent = op.split(' ')[0].toUpperCase();
    } else {
        badge.textContent = '✓ Done';
    }
    
    // Update operation display
    let operationText = 'Start traversal...';
    if (currentStep < executionSteps.length) {
        operationText = executionSteps[currentStep].operation;
    }
    document.getElementById('operation').textContent = operationText;

    // Update result array
    const resultArrayDiv = document.getElementById('resultArray');
    if (result.length === 0) {
        resultArrayDiv.innerHTML = '<span class="placeholder">Traversal result appears here...</span>';
    } else {
        resultArrayDiv.innerHTML = result.map((val, idx) => 
            `<div class="array-item">${val}</div>`
        ).join('');
    }

    // Update call stack visualization
    updateCallStackVisualization();

    // Update step explanation
    updateExplanation();

    // Update status message
    const statusDiv = document.getElementById('status');
    if (currentStep === executionSteps.length) {
        statusDiv.innerHTML = `✅ <strong>Perfect!</strong> Traversal complete. Result: [${result.join(', ')}]`;
        statusDiv.classList.add('completed');
    } else {
        const nextStep = executionSteps[currentStep];
        statusDiv.innerHTML = `👉 <strong>Step ${currentStep + 1}:</strong> ${nextStep.operation}`;
        statusDiv.classList.remove('completed');
    }

    // Update button states
    document.getElementById('prevBtn').disabled = currentStep === 0;
    document.getElementById('nextBtn').disabled = currentStep === executionSteps.length;

    // Redraw tree
    drawTree();
}

// ============================================
// CALL STACK VISUALIZATION
// ============================================

function updateCallStackVisualization() {
    const container = document.getElementById('callStackContainer');
    
    if (currentStep === 0) {
        container.innerHTML = '<div class="call-stack-empty">Stack is empty. Click Next to begin!</div>';
        return;
    }

    const currentExecution = executionSteps[currentStep - 1];
    const callStack = currentExecution.callStack;

    if (callStack.length === 0) {
        container.innerHTML = '<div class="call-stack-empty">Stack is empty</div>';
        return;
    }

    // Sort by depth to show top of stack at bottom
    const sortedStack = callStack.sort((a, b) => b.depth - a.depth);

    const html = sortedStack.map((frame, idx) => {
        const depth = frame.depth;
        const indentLevel = depth * 20;
        const statusClass = frame.state;
        const statusText = frame.state.toUpperCase();

        return `
            <div class="call-stack-frame ${statusClass}" style="--depth-indent: ${indentLevel}px;">
                <span class="call-stack-status">${statusText}</span>
                <span class="call-stack-node">inorder(${frame.nodeVal})</span>
                <span class="call-stack-arrow">→</span>
                <span style="color: #6b7280; font-size: 12px;">Depth: ${depth}</span>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// ============================================
// CODE HIGHLIGHT FUNCTION
// ============================================

function updateCodeHighlight(lineNumber) {
    // Remove all active highlights
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach(line => line.classList.remove('active'));
    
    // Add active highlight to current line
    if (lineNumber >= 0) {
        const currentLine = document.querySelector(`[data-line="${lineNumber}"]`);
        if (currentLine) {
            currentLine.classList.add('active');
        }
    }
    
    // Update code status
    const lineDescriptions = [
        'Function Entry',
        'Check if null',
        'Return statement',
        'Traverse Left Subtree',
        'Process Current Node',
        'Traverse Right Subtree'
    ];
    
    const codeStatus = document.getElementById('codeStatus');
    if (lineNumber >= 0 && lineNumber < lineDescriptions.length) {
        codeStatus.textContent = `Current Line (${lineNumber + 1}): ${lineDescriptions[lineNumber]}`;
        codeStatus.setAttribute('data-line', lineDescriptions[lineNumber]);
    } else {
        codeStatus.textContent = 'Execution Complete';
        codeStatus.removeAttribute('data-line');
    }
}

// ============================================
// CANVAS DRAWING
// ============================================

const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas size
function resizeCanvas() {
    const section = canvas.parentElement;
    const sectionRect = section.getBoundingClientRect();
    const header = section.querySelector('.section-header');
    const info = section.querySelector('.tree-info');
    const verticalChrome = (header ? header.offsetHeight : 0) + (info ? info.offsetHeight : 0) + 36;
    const availableHeight = Math.max(260, Math.floor(sectionRect.height - verticalChrome));

    canvas.width = Math.max(380, Math.floor(sectionRect.width - 2));
    canvas.height = availableHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawTree() {
    const padding = 30;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = 'rgba(99, 102, 241, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reset node positions for this redraw
    nodePositions = {};
    
    // Draw all nodes and store positions
    drawNode(root, canvas.width / 2, 40, 80);
    
    // Draw traversal path arrows
    drawTraversalPath();
}

function drawNode(node, x, y, offsetX) {
    if (node === null) return;

    // Store node position for path drawing
    nodePositions[node.val] = { x, y };

    const radius = 28;
    const lineWidth = 2.5;

    // Draw connections to children
    if (node.left) {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - offsetX, y + 80);
        ctx.stroke();
        drawNode(node.left, x - offsetX, y + 80, offsetX / 2);
    }

    if (node.right) {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + offsetX, y + 80);
        ctx.stroke();
        drawNode(node.right, x + offsetX, y + 80, offsetX / 2);
    }

    // Determine node color and style based on state
    let fillColor = '#f3f4f6';
    let borderColor = '#d1d5db';
    let textColor = '#6b7280';
    let borderWidth = 2;
    let glowColor = 'transparent';
    let stateLabel = '';

    const nodeState = nodeStates[node.val] || 'unvisited';

    switch (nodeState) {
        case 'unvisited':
            fillColor = '#f3f4f6';
            borderColor = '#d1d5db';
            textColor = '#6b7280';
            borderWidth = 2;
            break;
        case 'exploring_left':
            fillColor = '#bfdbfe';
            borderColor = '#3b82f6';
            textColor = '#1e40af';
            borderWidth = 2.5;
            glowColor = 'rgba(59, 130, 246, 0.3)';
            stateLabel = '←';
            break;
        case 'current':
            fillColor = '#fbbf24';
            borderColor = '#f59e0b';
            textColor = '#fff';
            borderWidth = 3;
            glowColor = 'rgba(245, 158, 11, 0.5)';
            stateLabel = '●';
            break;
        case 'exploring_right':
            fillColor = '#d8b4fe';
            borderColor = '#a855f7';
            textColor = '#6b21a8';
            borderWidth = 2.5;
            glowColor = 'rgba(168, 85, 247, 0.3)';
            stateLabel = '→';
            break;
        case 'completed':
            fillColor = '#86efac';
            borderColor = '#22c55e';
            textColor = '#166534';
            borderWidth = 2.5;
            glowColor = 'rgba(34, 197, 94, 0.2)';
            stateLabel = '✓';
            break;
    }

    // Draw glow effect
    if (glowColor !== 'transparent') {
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(x, y, radius + 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw circle
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 20px Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.val, x, y);
    
    // Draw state label if exists
    if (stateLabel) {
        ctx.fillStyle = borderColor;
        ctx.font = 'bold 14px Arial';
        ctx.fillText(stateLabel, x + radius + 8, y - radius - 8);
    }
}

// ============================================
// TRAVERSAL PATH VISUALIZATION
// ============================================

function drawTraversalPath() {
    if (currentStep === 0 || !currentNode) return;
    
    const currentExecution = executionSteps[currentStep - 1];
    
    // Draw arrow from current operation's node to next node
    if (currentExecution && currentStep < executionSteps.length) {
        const nextExecution = executionSteps[currentStep];
        
        if (nextExecution.type === 'enter_function' && nextExecution.node) {
            const fromPos = nodePositions[currentExecution.node.val];
            const toPos = nodePositions[nextExecution.node.val];
            
            if (fromPos && toPos) {
                drawArrow(fromPos.x, fromPos.y, toPos.x, toPos.y, '#f97316', '→');
            }
        }
    }
}

function drawArrow(fromX, fromY, toX, toY, color, label) {
    const radius = 28;
    const headlen = 15;
    
    // Calculate direction
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return;
    
    // Normalize
    const ux = dx / distance;
    const uy = dy / distance;
    
    // Calculate start and end points on circle perimeters
    const startX = fromX + ux * radius;
    const startY = fromY + uy * radius;
    const endX = toX - ux * radius;
    const endY = toY - uy * radius;
    
    // Draw curved arrow line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([5, 5]); // dashed line
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    // Use quadratic curve for arrow
    const controlX = (fromX + toX) / 2;
    const controlY = (fromY + toY) / 2 + 20;
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw arrowhead
    const angle = Math.atan2(uy, ux);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

// ============================================
// KEYBOARD CONTROLS
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStep();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousStep();
    }
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    generateExecutionSteps();
    updateUI();
});
