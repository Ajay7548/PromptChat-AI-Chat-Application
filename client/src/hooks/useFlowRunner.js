import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { INITIAL_NODES, INITIAL_EDGES } from '../constants/flowDefaults';
import { useAskAi } from './useAskAi';
import { useSaveConversation } from './useSaveConversation';

/**
 * Central orchestrator hook for the flow canvas.
 * Manages node/edge state, wires prompt input to AI calls,
 * handles save operations, and controls edge animations.
 *
 * Keeps the FlowCanvas component purely presentational by
 * encapsulating all state management and side effects here.
 *
 * @returns {{
 *   nodes: Array, edges: Array, onNodesChange: Function, onEdgesChange: Function,
 *   promptText: string, lastResponse: string,
 *   handleRunFlow: () => Promise<void>, handleSave: () => Promise<void>,
 *   aiLoading: boolean, saveLoading: boolean, canSave: boolean,
 *   saveStatus: string, saveError: string|null, resetSaveState: () => void
 * }}
 */
export function useFlowRunner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [promptText, setPromptText] = useState('');
  const [lastResponse, setLastResponse] = useState('');

  const { execute: runAi, isLoading: aiLoading, error: aiError } = useAskAi();
  const { execute: save, isLoading: saveLoading, status: saveStatus, error: saveError } = useSaveConversation();

  // Derive the result node status from hook states
  const resultStatus = deriveResultStatus(aiLoading, aiError, lastResponse);

  // Sync node data whenever prompt text or result state changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'input-1') {
          return { ...node, data: { ...node.data, prompt: promptText, onChange: setPromptText } };
        }
        if (node.id === 'result-1') {
          return {
            ...node,
            data: { ...node.data, response: lastResponse, status: resultStatus, error: aiError },
          };
        }
        return node;
      })
    );
  }, [promptText, lastResponse, resultStatus, aiError, setNodes]);

  /** Sends the current prompt to the AI and animates the edge during the call. */
  const handleRunFlow = useCallback(async () => {
    if (!promptText.trim() || aiLoading) return;

    setEdges((eds) => eds.map((e) => ({ ...e, animated: true })));

    const response = await runAi(promptText);
    if (response) setLastResponse(response);

    setEdges((eds) => eds.map((e) => ({ ...e, animated: false })));
  }, [promptText, aiLoading, runAi, setEdges]);

  /** Saves the current prompt and response to MongoDB. */
  const handleSave = useCallback(async () => {
    if (!promptText.trim() || !lastResponse) return;
    await save(promptText, lastResponse);
  }, [promptText, lastResponse, save]);

  const canSave = !!lastResponse && !!promptText.trim() && !saveLoading;

  /** Loads a saved prompt/response pair back into the canvas. */
  const loadFlow = useCallback((prompt, response) => {
    setPromptText(prompt);
    setLastResponse(response);
  }, []);

  return {
    nodes, edges, onNodesChange, onEdgesChange,
    handleRunFlow, handleSave, loadFlow,
    aiLoading, saveLoading, canSave,
    saveStatus, saveError,
  };
}

/**
 * Maps the current loading/error/data states to a single status string
 * used by the ResultNode for conditional rendering.
 */
function deriveResultStatus(isLoading, error, response) {
  if (isLoading) return 'loading';
  if (error) return 'error';
  if (response) return 'success';
  return 'idle';
}
