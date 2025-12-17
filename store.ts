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
            onNodesChange: (changes) => {
                set({
                    nodes: applyNodeChanges(changes, get().nodes),
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
                set({
                    nodes: [...get().nodes, node],
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
