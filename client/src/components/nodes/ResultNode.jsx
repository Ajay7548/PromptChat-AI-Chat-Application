import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import Spinner from '../ui/Spinner';
import './ResultNode.css';

/**
 * Custom React Flow node that displays the AI response.
 * Renders different states: idle placeholder, loading spinner,
 * success with scrollable response, or error message.
 */
function ResultNode({ data }) {
  return (
    <div className={`result-node result-node--${data.status}`}>
      <div className="result-node__header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <span>AI Response</span>
      </div>
      <div className="result-node__body nowheel">
        {renderContent(data)}
      </div>
      <Handle type="target" position={Position.Left} className="result-node__handle" />
    </div>
  );
}

/** Maps data.status to the appropriate content element. */
function renderContent(data) {
  if (data.status === 'loading') {
    return (
      <div className="result-node__loading">
        <Spinner size={22} />
        <span>Thinking...</span>
      </div>
    );
  }

  if (data.status === 'error') {
    return <p className="result-node__error">{data.error}</p>;
  }

  if (data.status === 'success') {
    return <p className="result-node__text">{data.response}</p>;
  }

  return <p className="result-node__placeholder">Run the flow to see results...</p>;
}

export default memo(ResultNode);
