import { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import './TextInputNode.css';

/**
 * Custom React Flow node with a textarea for entering AI prompts.
 * Uses `nodrag nowheel` classes on the textarea so React Flow
 * does not intercept typing or scrolling interactions.
 */
function TextInputNode({ data }) {
  const handleChange = useCallback(
    (e) => data.onChange(e.target.value),
    [data]
  );

  return (
    <div className="input-node">
      <div className="input-node__header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        <span>Prompt</span>
      </div>
      <textarea
        className="input-node__textarea nodrag nowheel"
        placeholder="Type your question here..."
        value={data.prompt || ''}
        onChange={handleChange}
        rows={5}
      />
      <Handle type="source" position={Position.Right} className="input-node__handle" />
    </div>
  );
}

export default memo(TextInputNode);
