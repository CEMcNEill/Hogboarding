import { create } from 'zustand';
import { liveblocks } from '@liveblocks/zustand';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';
import type { WithLiveblocks } from '@liveblocks/zustand';

type FlowState = {
    nodes: Node[];
    edges: Edge[];
    futureNodes: Node[];
    futureEdges: Edge[];
    viewMode: 'current' | 'future';
    selectedNodeIds: string[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    addNode: (node: Node) => void;
    setNodes: (nodes: Node[]) => void;
    setViewMode: (mode: 'current' | 'future') => void;
    copyCurrentToFuture: () => void;
    updateNodeData: (id: string, data: any) => void;
    deleteNode: (id: string) => void;
};

import { createClient } from '@liveblocks/client';

const client = createClient({
    publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || 'pk_test_PLACEHOLDER',
});

const useStore = create<WithLiveblocks<FlowState>>()(
    liveblocks(
        (set, get) => ({
            nodes: [],
            edges: [],
            futureNodes: [],
            futureEdges: [],
            selectedNodeIds: [],
            viewMode: 'current',
            setViewMode: (mode) => set({ viewMode: mode }),
            copyCurrentToFuture: () => {
                const { nodes, edges } = get();
                // Deep copy to avoid reference issues, though structured clone or simple spread usually enough for serializable data
                // We want to ensure unique IDs if we were adding to existing, but here we replace.
                // However, we probably want to keep IDs same to track "modifications" vs "new".
                set({
                    futureNodes: JSON.parse(JSON.stringify(nodes)),
                    futureEdges: JSON.parse(JSON.stringify(edges)),
                });
            },
            onNodesChange: (changes) => {
                // 1. Handle selection changes locally
                const selectionChanges = changes.filter((change) => change.type === 'select');
                if (selectionChanges.length > 0) {
                    let newSelectedIds = new Set(get().selectedNodeIds);

                    selectionChanges.forEach((change) => {
                        if (change.type === 'select') {
                            if (change.selected) {
                                newSelectedIds.add(change.id);
                            } else {
                                newSelectedIds.delete(change.id);
                            }
                        }
                    });

                    // Handle "replace" logic (if ReactFlow sends a 'reset' signal, but usually it sends explicit selects)
                    // Actually, ReactFlow usually implies multi-selection or single selection based on keys.
                    // For simply tracking ids:
                    set({ selectedNodeIds: Array.from(newSelectedIds) });
                }

                // 2. Forward other changes to the shared store, BUT STRIP SELECTION info
                // We must accept that `applyNodeChanges` might try to update `selected` on the nodes it returns.
                // So we have to sanitize the result of `applyNodeChanges` before setting it to state.

                const otherChanges = changes.filter((change) => change.type !== 'select');

                if (otherChanges.length === 0) return;

                const { viewMode } = get();
                const isFuture = viewMode === 'future';
                const currentNodes = isFuture ? get().futureNodes : get().nodes;
                const nextNodes = applyNodeChanges(otherChanges, currentNodes);

                // IMPORTANT: Ensure no node in the shared state is marked as selected.
                // If `applyNodeChanges` preserved a `selected: true` from a previous state (which shouldn't happen if we clean it),
                // or if a change implicitly set it (unlikely for non-select changes), we strip it.
                const storedNodes = nextNodes.map(node => {
                    if (node.selected) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { selected, ...rest } = node;
                        return rest;
                    }
                    return node;
                });

                if (isFuture) {
                    set({ futureNodes: storedNodes });
                } else {
                    set({ nodes: storedNodes });
                }
            },
            onEdgesChange: (changes) => {
                const { viewMode } = get();
                const isFuture = viewMode === 'future';
                const currentEdges = isFuture ? get().futureEdges : get().edges;
                const nextEdges = applyEdgeChanges(changes, currentEdges);

                if (isFuture) {
                    set({ futureEdges: nextEdges });
                } else {
                    set({ edges: nextEdges });
                }
            },
            onConnect: (connection) => {
                const { viewMode } = get();
                const isFuture = viewMode === 'future';
                const currentEdges = isFuture ? get().futureEdges : get().edges;
                const nextEdges = addEdge(connection, currentEdges);

                if (isFuture) {
                    set({ futureEdges: nextEdges });
                } else {
                    set({ edges: nextEdges });
                }
            },
            addNode: (node) => {
                // Ensure we don't accidentally save 'selected: true' to the shared store
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { selected, ...nodeData } = node;

                const { viewMode } = get();
                if (viewMode === 'future') {
                    set({
                        futureNodes: [...get().futureNodes, nodeData],
                    });
                } else {
                    set({
                        nodes: [...get().nodes, nodeData],
                    });
                }
            },
            setNodes: (nodes) => {
                const { viewMode } = get();
                if (viewMode === 'future') {
                    set({ futureNodes: nodes });
                } else {
                    set({ nodes });
                }
            },
            updateNodeData: (id, data) => {
                const { viewMode } = get();
                const isFuture = viewMode === 'future';
                const targetNodes = isFuture ? get().futureNodes : get().nodes; // Correctly select source

                const updatedNodes = targetNodes.map((node) => {
                    if (node.id === id) {
                        return { ...node, data: { ...node.data, ...data } }; // Merge data
                    }
                    return node;
                });

                if (isFuture) {
                    set({ futureNodes: updatedNodes });
                } else {
                    set({ nodes: updatedNodes });
                }
            },
            deleteNode: (id) => {
                const { viewMode } = get();
                const isFuture = viewMode === 'future';
                const targetNodes = isFuture ? get().futureNodes : get().nodes;

                const filteredNodes = targetNodes.filter((n) => n.id !== id);

                if (isFuture) {
                    set({ futureNodes: filteredNodes });
                } else {
                    set({ nodes: filteredNodes });
                }
            },
        }),
        {
            client,
            storageMapping: {
                nodes: true,
                edges: true,
                futureNodes: true,
                futureEdges: true,
            },
        }
    )
);

export default useStore;
