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
    selectedNodeIds: string[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    addNode: (node: Node) => void;
    setNodes: (nodes: Node[]) => void;
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
            selectedNodeIds: [],
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

                const currentNodes = get().nodes;
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

                set({
                    nodes: storedNodes,
                });
            },
            onEdgesChange: (changes) => {
                set({
                    edges: applyEdgeChanges(changes, get().edges),
                });
            },
            onConnect: (connection) => {
                set({
                    edges: addEdge(connection, get().edges),
                });
            },
            addNode: (node) => {
                // Ensure we don't accidentally save 'selected: true' to the shared store
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { selected, ...nodeData } = node;
                set({
                    nodes: [...get().nodes, nodeData],
                });
            },
            setNodes: (nodes) => {
                set({ nodes });
            },
        }),
        {
            client,
            storageMapping: {
                nodes: true,
                edges: true,
            },
        }
    )
);

export default useStore;
