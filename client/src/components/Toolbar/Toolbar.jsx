import Spinner from '../ui/Spinner';
import './Toolbar.css';

/**
 * Floating toolbar with "Run Flow", "Save", and "View History" action buttons.
 *
 * @param {{ onRun: () => void, onSave: () => void, onViewHistory: () => void, isRunning: boolean, isSaving: boolean, canSave: boolean }} props
 */
export default function Toolbar({ onRun, onSave, onViewHistory, isRunning, isSaving, canSave }) {
  return (
    <div className="toolbar">
      <button
        className="toolbar__btn toolbar__btn--primary"
        onClick={onRun}
        disabled={isRunning}
      >
        {isRunning ? (
          <>
            <Spinner size={16} />
            <span>Running...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Run Flow</span>
          </>
        )}
      </button>

      <button
        className="toolbar__btn toolbar__btn--secondary"
        onClick={onSave}
        disabled={!canSave || isSaving}
      >
        {isSaving ? (
          <>
            <Spinner size={16} />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Save</span>
          </>
        )}
      </button>

      <button
        className="toolbar__btn toolbar__btn--tertiary"
        onClick={onViewHistory}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>View History</span>
      </button>
    </div>
  );
}
