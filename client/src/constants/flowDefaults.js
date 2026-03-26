import TextInputNode from '../components/nodes/TextInputNode';
import ResultNode from '../components/nodes/ResultNode';

/**
 * Node type registry — defined at module scope to prevent
 * React Flow from unmounting and remounting nodes on every render.
 */
export const NODE_TYPES = {
  textInput: TextInputNode,
  result: ResultNode,
};

export const INITIAL_NODES = [
  {
    id: 'input-1',
    type: 'textInput',
    position: { x: 100, y: 200 },
    data: { prompt: '', onChange: () => {} },
  },
  {
    id: 'result-1',
    type: 'result',
    position: { x: 600, y: 200 },
    data: { response: '', status: 'idle', error: null },
  },
];

export const INITIAL_EDGES = [
  {
    id: 'edge-input-result',
    source: 'input-1',
    target: 'result-1',
    animated: false,
    type: 'smoothstep',
    style: { stroke: '#6366f1', strokeWidth: 2 },
  },
];
