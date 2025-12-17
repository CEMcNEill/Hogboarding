'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    ReactFlowProvider,
    ReactFlowInstance,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useStore from '../store';
import Cursors from './Cursors';

import CustomNode from './CustomNode';

const nodeTypes = {
    customNode: CustomNode,
};

import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { Panel } from 'reactflow';
import { Download, Trash2, Share2 } from 'lucide-react';

function Flow({ roomId }: { roomId: string }) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null); // Use ref to avoid re-renders or dependency issues if possible, but state is fine too.

    // Connect to the room
    const { enterRoom, leaveRoom } = useStore((state) => state.liveblocks);
    useEffect(() => {
        enterRoom(roomId);
        return () => {
            leaveRoom();
        };
    }, [enterRoom, leaveRoom, roomId]); // Re-enter if roomId changes

    // Selectors
    const rawNodes = useStore((state) => state.nodes);
    const selectedNodeIds = useStore((state) => state.selectedNodeIds);
    const nodes = React.useMemo(() => rawNodes.map((node) => ({
        ...node,
        selected: selectedNodeIds.includes(node.id),
    })), [rawNodes, selectedNodeIds]);
    const edges = useStore((state) => state.edges);
    const onNodesChange = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect = useStore((state) => state.onConnect);
    const addNode = useStore((state) => state.addNode);
    const setNodes = useStore((state) => state.setNodes);

    const { screenToFlowPosition, getNodes } = useReactFlow();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current) {
                return;
            }

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');
            const iconType = event.dataTransfer.getData('application/reactflow/iconType');
            const category = event.dataTransfer.getData('application/reactflow/category');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            // Use screenToFlowPosition from useReactFlow instead of instance
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `${type}-${Date.now()}`,
                type: 'customNode',
                position,
                data: { label: label || `${type} node`, iconType, category },
                style: {} // CustomNode handles styling
            };

            addNode(newNode);
        },
        [addNode, screenToFlowPosition],
    );

    const downloadImage = () => {
        if (reactFlowWrapper.current === null) {
            return;
        }

        toPng(reactFlowWrapper.current, { cacheBust: true, backgroundColor: '#fff' })
            .then((dataUrl) => {
                download(dataUrl, 'posthog-stack.png');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Clear nodes (Not exposed in store? I need to expose a clear action or just setNodes([]))
    // Actually, onNodesChange handles changes, but I need a 'setNodes' action in store if I want to clear?
    // Let's assume I can't easily clear without adding an action to store.
    // For MVP, I'll skip Clear Board unless I modify store.
    // But wait, the plan said "Add Clear Board".
    // I will use `window.location.reload()` as a hack? No, that doesn't clear shared state.
    // I need to add `clearBoard` to store.

    const clearBoard = () => {
        setNodes([]);
    };

    return (
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
            <Cursors />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background gap={16} size={1} color="#aaa" />
                <Controls />
                <Panel position="top-right" className="flex gap-2">
                    <button
                        className="bg-white p-2 rounded shadow border border-slate-200 hover:bg-slate-50 text-slate-700"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copied to clipboard!');
                        }}
                        title="Share Board"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        className="bg-white p-2 rounded shadow border border-slate-200 hover:bg-slate-50 text-slate-700"
                        onClick={downloadImage}
                        title="Download Image"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button
                        className="bg-white p-2 rounded shadow border border-slate-200 hover:bg-red-50 text-red-500"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear the entire board? This cannot be undone.')) {
                                clearBoard();
                            }
                        }}
                        title="Clear Board"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </Panel>
            </ReactFlow>
        </div>
    );
}

export default function FlowWithProvider({ roomId }: { roomId: string }) {
    return (
        <ReactFlowProvider>
            <Flow roomId={roomId} />
        </ReactFlowProvider>
    );
}
