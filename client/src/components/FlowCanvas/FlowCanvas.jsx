import { ReactFlow, Background, Controls } from '@xyflow/react';
import { useCallback, useState } from 'react';
import { NODE_TYPES } from '../../constants/flowDefaults';
import { useFlowRunner } from '../../hooks/useFlowRunner';
import Toolbar from '../Toolbar/Toolbar';
import HistorySidebar from '../HistorySidebar/HistorySidebar';
import Toast from '../ui/Toast';
import './FlowCanvas.css';

/**
 * Presentational wrapper around ReactFlow.
 * All state management lives in the useFlowRunner hook.
 */
export default function FlowCanvas() {
  const {
    nodes, edges, onNodesChange, onEdgesChange,
    handleRunFlow, handleSave, loadFlow,
    aiLoading, saveLoading, canSave,
    saveStatus, saveError,
  } = useFlowRunner();

  const [toast, setToast] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const onSave = useCallback(async () => {
    await handleSave();
    setToast({ message: 'Saved to database!', type: 'success' });
  }, [handleSave]);

  const onLoadFlow = useCallback((item) => {
    loadFlow(item.prompt, item.response);
    setHistoryOpen(false);
  }, [loadFlow]);

  const onSaveError = saveError && !toast
    ? { message: saveError, type: 'error' }
    : null;

  const activeToast = toast || onSaveError;

  return (
    <div className="flow-canvas">
      <Toolbar
        onRun={handleRunFlow}
        onSave={onSave}
        onViewHistory={() => setHistoryOpen(true)}
        isRunning={aiLoading}
        isSaving={saveLoading}
        canSave={canSave}
      />
      <div className="flow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.4 }}
          defaultEdgeOptions={{ type: 'smoothstep' }}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant="dots" gap={20} size={1} color="#cbd5e1" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <HistorySidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onLoad={onLoadFlow}
      />
      {activeToast && (
        <Toast
          message={activeToast.message}
          type={activeToast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
