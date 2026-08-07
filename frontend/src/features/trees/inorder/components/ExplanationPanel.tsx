import { Lightbulb, ArrowRight, ShieldAlert, Sparkles, RefreshCw, ListCheck } from "lucide-react";
import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number[];
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

interface DetailItem {
  icon: "rule" | "next" | "stop" | "snapshot" | "return";
  text: string;
}

function getExplanation(
  step: ExecutionStep | undefined,
  currentStep: number,
  totalSteps: number,
  result: number[],
  currentCodeLine: number,
): { title: string; description: string; details: DetailItem[] } {
  if (!step && currentStep === 0) {
    return {
      title: "Ready to Start Traversal",
      description:
        'Click "Next Step" to walk through the Inorder Traversal step-by-step (Left → Root → Right).',
      details: [
        { icon: "next", text: "Code starts execution from recursiveInorder(root, arr)." },
        { icon: "rule", text: "Watch the tree node highlights and call stack update together." },
      ],
    };
  }

  if (currentStep >= totalSteps) {
    return {
      title: "Traversal Complete!",
      description: `All nodes have been visited in Left → Root → Right order. Final result: [${result.join(", ")}].`,
      details: [
        { icon: "snapshot", text: `Total execution steps completed: ${totalSteps}` },
        { icon: "return", text: "Click Reset or Previous to inspect any step again." },
      ],
    };
  }

  const codeLineNum = currentCodeLine + 1;
  const nodeVal = step?.value ?? step?.node?.val;

  switch (step?.type) {
    case "enter_function":
      return {
        title: `Line ${codeLineNum}: Enter inorder(node=${nodeVal})`,
        description: `Python creates a new stack frame for Node ${nodeVal} and pushes it onto the Call Stack. The parent call is paused until this frame finishes.`,
        details: [
          { icon: "rule", text: `Rule: Left subtree of Node ${nodeVal} must finish before Node ${nodeVal} records its value.` },
          { icon: "next", text: `Next Step: Call inorder(node.left) to explore Node ${nodeVal}'s left subtree first.` },
        ],
      };
    case "base_case":
      return {
        title: `Line ${codeLineNum}: Base Case Check (node is None)`,
        description: `We reached an empty child (None). The condition 'if root is None' evaluates to True, so this call returns immediately without adding anything to the result.`,
        details: [
          { icon: "stop", text: "Base Case: Stops the recursion from going infinitely deep." },
          { icon: "return", text: "Next Step: Control returns back to the parent frame waiting on the Call Stack." },
        ],
      };
    case "traverse_left": {
      const hasLeftChild = Boolean(step?.node?.left);
      return {
        title: hasLeftChild
          ? `Line ${codeLineNum}: Go Left — Call inorder(node=${step?.node?.left?.val})`
          : `Line ${codeLineNum}: No Left Child — Base Case Fires`,
        description: hasLeftChild
          ? `Node ${nodeVal}'s left subtree must be fully explored before Node ${nodeVal} can record its own value. Python calls inorder(${step?.node?.left?.val}) and pauses Node ${nodeVal}'s frame.`
          : `Node ${nodeVal} has no left child (left = None). Python calls inorder(None) — the very first line checks 'if root is None:' which is True, so the function returns immediately. Control comes straight back to Node ${nodeVal}.`,
        details: [
          { icon: "rule", text: `Left First: Inorder must finish the entire left subtree before recording Node ${nodeVal}.` },
          hasLeftChild
            ? { icon: "next", text: `Next Step: Enter function frame for left child Node ${step?.node?.left?.val}.` }
            : { icon: "next", text: `Next Step: Base case returned. Node ${nodeVal} will now record its own value.` },
        ],
      };
    }
    case "visit":
      return {
        title: `Line ${codeLineNum}: Append Node ${nodeVal} to Result`,
        description: `Left side of Node ${nodeVal} is complete! Now we record Node ${nodeVal}'s value by calling arr.append(${nodeVal}). This is the 'Root' step in Left → Root → Right.`,
        details: [
          { icon: "snapshot", text: `Result Array snapshot: [${result.concat(nodeVal != null ? [nodeVal] : []).join(", ")}]` },
          { icon: "next", text: `Next Step: Call inorder(node.right) to explore Node ${nodeVal}'s right subtree.` },
        ],
      };
    case "traverse_right": {
      const hasRightChild = Boolean(step?.node?.right);
      return {
        title: hasRightChild
          ? `Line ${codeLineNum}: Go Right — Call inorder(node=${step?.node?.right?.val})`
          : `Line ${codeLineNum}: No Right Child — Base Case Fires`,
        description: hasRightChild
          ? `Node ${nodeVal} is recorded. Now exploring its right subtree by calling inorder(${step?.node?.right?.val}). Node ${nodeVal}'s frame is paused.`
          : `Node ${nodeVal} has no right child (right = None). Python calls inorder(None) — 'if root is None:' fires immediately and returns. Node ${nodeVal} is now fully done.`,
        details: [
          { icon: "rule", text: `Right Last: After Left and Root (${nodeVal}), the final step is to explore the right subtree.` },
          hasRightChild
            ? { icon: "next", text: `Next Step: Enter function frame for right child Node ${step?.node?.right?.val}.` }
            : { icon: "next", text: `Next Step: Base case returned. Node ${nodeVal} will now return (exit its frame).` },
        ],
      };
    }
    case "exit_function": {
      const parentFrame = step?.callStack?.[step.callStack.length - 1];
      const parentVal = parentFrame?.nodeVal;
      return {
        title: `Line ${codeLineNum}: Return from Node ${nodeVal}`,
        description: `Node ${nodeVal} is fully done — Left subtree explored, value ${nodeVal} recorded, Right subtree explored. Python pops Node ${nodeVal} off the Call Stack.`,
        details: [
          {
            icon: "return",
            text: parentVal != null
              ? `Unwinding Stack: Returning control to Node ${parentVal}'s frame (it called inorder(${nodeVal})).`
              : `Stack is now empty — all frames have returned. Traversal is complete.`,
          },
          {
            icon: "next",
            text: parentVal != null
              ? `Next Step: Node ${parentVal}'s frame resumes from where it was paused.`
              : `The result array now contains the full inorder sequence.`,
          },
        ],
      };
    }
    default:
      return {
        title: `Line ${codeLineNum}: Traversal Step`,
        description: "Executing traversal step.",
        details: [{ icon: "snapshot", text: `Result: [${result.join(", ")}]` }],
      };
  }
}

export function ExplanationPanel({
  currentStep,
  totalSteps,
  result,
  activeStep,
  currentCodeLine,
}: ExplanationPanelProps) {
  const explanation = getExplanation(
    activeStep,
    currentStep,
    totalSteps,
    result,
    currentCodeLine,
  );

  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Step Explanation
        </h2>
      </div>

      <div className="min-h-0 space-y-2 overflow-auto rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-2.5 shadow-sm">
        <h3 className="text-[13px] font-bold text-cyan-950 flex items-center gap-1.5">
          <Sparkles size={14} className="text-cyan-600 shrink-0" />
          {explanation.title}
        </h3>
        <p className="text-[11px] leading-[1.5] text-cyan-800 font-medium">{explanation.description}</p>
        <ul className="grid gap-1.5 text-[11px] pt-0.5">
          {explanation.details.map((detail, idx) => (
            <li key={`${detail.text}-${idx}`} className="flex items-start gap-2 rounded-lg border border-sky-200/80 bg-white/90 px-2.5 py-1.5 text-cyan-950 font-medium shadow-2xs">
              {detail.icon === "rule" && <Lightbulb size={13} className="text-amber-500 shrink-0 mt-0.5" />}
              {detail.icon === "next" && <ArrowRight size={13} className="text-sky-600 shrink-0 mt-0.5" />}
              {detail.icon === "stop" && <ShieldAlert size={13} className="text-rose-500 shrink-0 mt-0.5" />}
              {detail.icon === "snapshot" && <ListCheck size={13} className="text-emerald-600 shrink-0 mt-0.5" />}
              {detail.icon === "return" && <RefreshCw size={13} className="text-indigo-500 shrink-0 mt-0.5" />}
              <span>{detail.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
