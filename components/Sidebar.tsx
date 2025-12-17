'use client';

import React, { useState } from 'react';
import { ProductIcon, ProductIconType } from './ProductIcon';
import { ChevronDown, ChevronRight } from 'lucide-react';

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
];

export default function Sidebar() {
    const onDragStart = (event: React.DragEvent, nodeType: string, label: string, iconType: string, category: string) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.setData('application/reactflow/iconType', iconType);
        event.dataTransfer.setData('application/reactflow/category', category);
        event.dataTransfer.effectAllowed = 'move';
    };

    const DraggableItem = ({ label, iconType, category }: any) => (
        <div
            className="p-2 bg-white border border-slate-200 rounded cursor-grab shadow-sm flex items-center gap-2 hover:border-orange-500 transition-colors group"
            onDragStart={(event) => onDragStart(event, 'customNode', label, iconType, category)}
            draggable
        >
            <div className="text-slate-500 group-hover:text-orange-600">
                <ProductIcon type={iconType} className="w-4 h-4" />
            </div>
            <span className="text-sm text-slate-700 font-medium">{label}</span>
        </div>
    );

    return (
        <aside className="w-[280px] bg-slate-50 border-r border-slate-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-white">
                <h1 className="font-bold text-lg text-slate-900">HogBoard</h1>
                <p className="text-xs text-slate-500">Winning with PostHog</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                {SECTIONS.map((section) => (
                    <div key={section.title}>
                        <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider flex items-center gap-1">
                            {section.title}
                        </h3>
                        <div className="flex flex-col gap-2">
                            {section.items.map((item) => (
                                <DraggableItem
                                    key={item.label}
                                    label={item.label}
                                    iconType={item.iconType}
                                    category={item.category}
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
    );
}
