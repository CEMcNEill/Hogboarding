import React, { useMemo } from 'react';
import useStore from '../store';
import { ProductIcon, ProductIconType } from './ProductIcon';
import { X, ArrowRight, Plus, Minus, ArrowRightLeft } from 'lucide-react';

interface RoadmapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ChangeType = 'added' | 'removed' | 'modified';

interface ChangeItem {
    id: string;
    type: ChangeType;
    label: string;
    iconType: string;
    category: string;
    details?: string;
}

export default function RoadmapModal({ isOpen, onClose }: RoadmapModalProps) {
    const nodes = useStore((state) => state.nodes);
    const futureNodes = useStore((state) => state.futureNodes);

    const changes = useMemo(() => {
        const changeList: ChangeItem[] = [];
        const currentMap = new Map(nodes.map(n => [n.id, n]));
        const futureMap = new Map(futureNodes.map(n => [n.id, n]));

        // Check for Added and Modified
        futureNodes.forEach(fNode => {
            const cNode = currentMap.get(fNode.id);
            if (!cNode) {
                changeList.push({
                    id: fNode.id,
                    type: 'added',
                    label: fNode.data.label,
                    iconType: fNode.data.iconType,
                    category: fNode.data.category || 'General',
                });
            } else {
                // Check if meaningful data changed (e.g., label or provider status)
                // For now, let's just check if "provider" changed status (e.g. to PostHog)
                if (cNode.data.provider !== fNode.data.provider) {
                    changeList.push({
                        id: fNode.id,
                        type: 'modified',
                        label: fNode.data.label,
                        iconType: fNode.data.iconType,
                        category: fNode.data.category || 'General',
                        details: fNode.data.provider === 'posthog' ? 'Switched to PostHog' : 'Switched from PostHog'
                    });
                }
            }
        });

        // Check for Removed
        nodes.forEach(cNode => {
            if (!futureMap.has(cNode.id)) {
                changeList.push({
                    id: cNode.id,
                    type: 'removed',
                    label: cNode.data.label,
                    iconType: cNode.data.iconType,
                    category: cNode.data.category || 'General',
                });
            }
        });

        return changeList;
    }, [nodes, futureNodes]);

    // Group by category
    const groupedChanges = useMemo(() => {
        const groups: Record<string, ChangeItem[]> = {};
        changes.forEach(change => {
            if (!groups[change.category]) {
                groups[change.category] = [];
            }
            groups[change.category].push(change);
        });
        return groups;
    }, [changes]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="bg-slate-900 text-white p-1 rounded">
                            <ArrowRight className="w-4 h-4" />
                        </span>
                        Implementation Roadmap
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 hover:text-slate-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {changes.length === 0 ? (
                        <div className="text-center text-slate-500 py-12">
                            <p className="text-lg font-medium">No changes detected.</p>
                            <p className="text-sm">Try modifying the "Future State" to generate a roadmap.</p>
                        </div>
                    ) : (
                        Object.entries(groupedChanges).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                    {category}
                                </h3>
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                            <div className={`p-2 rounded-lg ${item.type === 'added' ? 'bg-green-50 text-green-600' :
                                                    item.type === 'removed' ? 'bg-red-50 text-red-600' :
                                                        'bg-blue-50 text-blue-600'
                                                }`}>
                                                {item.type === 'added' && <Plus className="w-4 h-4" />}
                                                {item.type === 'removed' && <Minus className="w-4 h-4" />}
                                                {item.type === 'modified' && <ArrowRightLeft className="w-4 h-4" />}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <ProductIcon type={item.iconType} className="w-4 h-4 text-slate-400" />
                                                    <span className="font-semibold text-slate-900">{item.label}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    {item.type === 'added' && 'Add to stack'}
                                                    {item.type === 'removed' && 'Remove from stack'}
                                                    {item.type === 'modified' && (item.details || 'Update configuration')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
