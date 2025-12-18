'use client';

import React, { useState } from 'react';
import { ProductIcon, ProductIconType } from './ProductIcon';
import { ChevronDown, ChevronRight, Map, Share2, UserPlus } from 'lucide-react';
import useStore from '../store';
import RoadmapModal from './RoadmapModal';

const SECTIONS = [
    {
        title: 'Ingestion & Sources',
        items: [
            { label: 'Client App', iconType: 'app', category: 'Source' },
            { label: 'Backend API', iconType: 'server', category: 'Source' },
            { label: 'Website', iconType: 'website', category: 'Source' },
            { label: 'Docs Site', iconType: 'docs', category: 'Source' },
            { label: 'Community', iconType: 'community', category: 'Source' },
            { label: 'Data Warehouse', iconType: 'database', category: 'Data' },
            { label: 'CDP', iconType: 'cdp', category: 'Data' },
        ],
    },
    {
        title: 'Product Engineering',
        items: [
            { label: 'Feature Management', iconType: 'toggle', category: 'Product Eng' },
            { label: 'Session Replay', iconType: 'rewind', category: 'Product Eng' },
            { label: 'Experimentation', iconType: 'flask', category: 'Product Eng' },
            { label: 'Error Tracking', iconType: 'bug', category: 'Product Eng' },
            { label: 'Surveys', iconType: 'message', category: 'Product Eng' },
        ],
    },
    {
        title: 'Analytics & Insights',
        items: [
            { label: 'Product Analytics', iconType: 'graph', category: 'Analytics' },
            { label: 'Web Analytics', iconType: 'globe', category: 'Analytics' },
            { label: 'Business Intelligence', iconType: 'bi', category: 'Analytics' },
        ],
    },
    {
        title: 'Tools',
        items: [
            { label: 'Sticky Note', iconType: 'sticky-note', category: 'Annotation' },
        ],
    },
];

import InviteModal from './InviteModal';

export default function Sidebar({ roomId }: { roomId: string }) {
    const viewMode = useStore((state) => state.viewMode);
    const setViewMode = useStore((state) => state.setViewMode);
    const copyCurrentToFuture = useStore((state) => state.copyCurrentToFuture);
    const futureNodes = useStore((state) => state.futureNodes);

    const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const onDragStart = (event: React.DragEvent, nodeType: string, label: string, iconType: string, category: string) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.setData('application/reactflow/iconType', iconType);
        event.dataTransfer.setData('application/reactflow/category', category);
        event.dataTransfer.effectAllowed = 'move';
    };

    const DraggableItem = ({ label, iconType, category, nodeType = 'customNode' }: any) => (
        <div
            className="p-2 bg-white border border-slate-200 rounded cursor-grab shadow-sm flex items-center gap-2 hover:border-orange-500 transition-colors group"
            onDragStart={(event) => onDragStart(event, nodeType, label, iconType, category)}
            draggable
        >
            <div className="text-slate-500 group-hover:text-orange-600">
                <ProductIcon type={iconType} className="w-4 h-4" />
            </div>
            <span className="text-sm text-slate-700 font-medium">{label}</span>
        </div>
    );

    return (
        <>
            <RoadmapModal isOpen={isRoadmapOpen} onClose={() => setIsRoadmapOpen(false)} />
            <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} roomId={roomId} />

            <aside className="w-[280px] bg-slate-50 border-r border-slate-200 flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-white flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-lg text-slate-900">HogBoard</h1>
                            <p className="text-xs text-slate-500">Winning with PostHog</p>
                        </div>
                        {process.env.NEXT_PUBLIC_ENABLE_AUTH !== 'false' && (
                            <button
                                onClick={() => setIsInviteOpen(true)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Invite Members"
                            >
                                <UserPlus className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            className={`flex-1 py-1 px-3 text-xs font-medium rounded-md transition-colors ${viewMode === 'current' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            onClick={() => setViewMode('current')}
                        >
                            Current
                        </button>
                        <button
                            className={`flex-1 py-1 px-3 text-xs font-medium rounded-md transition-colors ${viewMode === 'future' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            onClick={() => setViewMode('future')}
                        >
                            Future
                        </button>
                    </div>

                    {viewMode === 'future' && futureNodes.length === 0 && (
                        <button
                            onClick={copyCurrentToFuture}
                            className="w-full py-2 px-3 bg-orange-50 text-orange-600 border border-orange-200 rounded-md text-xs font-medium hover:bg-orange-100 transition-colors"
                        >
                            Initialize from Current
                        </button>
                    )}

                    <button
                        className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors"
                        onClick={() => setIsRoadmapOpen(true)}
                    >
                        <Map className="w-4 h-4" />
                        Generate Roadmap
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                    {SECTIONS.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider flex items-center gap-1">
                                {section.title}
                            </h3>
                            <div className="flex flex-col gap-2">
                                {section.items.map((item: any) => (
                                    <DraggableItem
                                        key={item.label}
                                        label={item.label}
                                        iconType={item.iconType}
                                        category={item.category}
                                        nodeType={item.category === 'Annotation' ? 'annotation' : 'customNode'}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200 text-xs text-slate-400 bg-white">
                    Drag items to canvas
                </div>
            </aside>
        </>
    );
}
