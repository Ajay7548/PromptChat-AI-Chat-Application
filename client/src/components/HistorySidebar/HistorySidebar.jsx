import { useState, useEffect } from 'react';
import { getConversations, deleteConversation } from '../../services/api';
import './HistorySidebar.css';

export default function HistorySidebar({ isOpen, onClose, onLoad }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getConversations()
        .then(setHistory)
        .catch((err) => console.error('Failed to fetch history:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleDelete = async (id) => {
    try {
      await deleteConversation(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <span className="sidebar__title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Saved Flows
          </span>
          <button className="sidebar__close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="sidebar__list">
          {loading ? (
            <p className="sidebar__empty">Loading...</p>
          ) : history.length === 0 ? (
            <p className="sidebar__empty">No saved flows yet.</p>
          ) : (
            history.map((item) => (
              <div key={item._id} className="history-card">
                <div className="history-card__top">
                  <p className="history-card__prompt">{item.prompt}</p>
                  <button className="history-card__delete" onClick={() => handleDelete(item._id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
                <p className="history-card__response">{item.response}</p>
                <div className="history-card__footer">
                  <span className="history-card__date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button className="history-card__load" onClick={() => onLoad(item)}>
                    Load into flow
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
