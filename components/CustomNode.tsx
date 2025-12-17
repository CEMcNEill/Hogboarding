import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeToolbar } from 'reactflow';
import { ProductIcon, ProductIconType } from './ProductIcon';
import useStore from '../store';
import { Trash2, ArrowRightLeft } from 'lucide-react';

const CustomNode = ({ id, data, selected }: NodeProps) => {
    const iconType = data.iconType as ProductIconType;
    const status = data.status || 'none'; // evaluating, won
    const provider = data.provider || 'other'; // 'other' | 'posthog'

    const setNodes = useStore((state) => state.setNodes);
    const nodes = useStore((state) => state.nodes);

    const updateNodeData = (key: string, value: any) => {
        const newNodes = nodes.map((node) => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, [key]: value } };
            }
            return node;
        });
        setNodes(newNodes);
    };

    const deleteNode = () => {
        setNodes(nodes.filter((n) => n.id !== id));
    };

    const toggleProvider = () => {
        const newProvider = provider === 'posthog' ? 'other' : 'posthog';
        // Auto-update status if adopting PostHog
        if (newProvider === 'posthog' && status === 'none') {
            // Maybe don't auto-update status, just style.
            // Actually, let's keep it simple.
        }
        updateNodeData('provider', newProvider);
    };

    // Visual Styles
    let containerClass = "bg-white rounded-xl shadow-sm border border-slate-300 min-w-[200px] overflow-hidden transition-all";
    let headerClass = "bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2";
    let iconClass = "text-slate-500";

    if (provider === 'posthog') {
        containerClass = "bg-white rounded-xl shadow-lg border-[2px] border-[#F54E00] min-w-[200px] overflow-hidden transition-all";
        headerClass = "bg-[#FFF0E6] px-3 py-2 border-b border-orange-100 flex items-center gap-2";
        iconClass = "text-[#F54E00]";
    } else if (status === 'evaluating') {
        containerClass = "bg-white rounded-xl shadow-md border-[2px] border-blue-400 border-dashed min-w-[200px] overflow-hidden transition-all";
    }

    return (
        <>
            <NodeToolbar isVisible={selected} position={Position.Top} className="flex gap-2 p-2 bg-white rounded-lg shadow-2xl border border-slate-300 ring-1 ring-slate-100">
                <button
                    onClick={toggleProvider}
                    className={`text-xs font-semibold flex items-center gap-1 px-2 py-1.5 rounded border ${provider === 'posthog' ? 'bg-orange-50 border-orange-300 text-orange-800' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'}`}
                >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    {provider === 'posthog' ? 'Is PostHog' : 'Is Competitor'}
                </button>

                <select
                    className="text-xs font-medium text-slate-900 border border-slate-400 rounded px-2 py-1.5 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={status}
                    onChange={(e) => updateNodeData('status', e.target.value)}
                >
                    <option value="none">Status: Active</option>
                    <option value="evaluating">Evaluating PostHog</option>
                    <option value="won">Switched to PostHog</option>
                </select>

                <input
                    className="text-xs font-medium text-slate-900 border border-slate-400 rounded px-2 py-1.5 w-32 placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Evaluator..."
                    value={data.owner || ''}
                    onChange={(e) => updateNodeData('owner', e.target.value)}
                />

                {provider !== 'posthog' && (
                    <input
                        className="text-xs font-medium text-slate-900 border border-slate-400 rounded px-2 py-1.5 w-32 placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Competitor Name..."
                        value={data.currentTool || ''}
                        onChange={(e) => updateNodeData('currentTool', e.target.value)}
                    />
                )}

                <button onClick={deleteNode} className="text-red-600 hover:bg-red-50 hover:text-red-700 p-1.5 rounded border border-transparent hover:border-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </NodeToolbar>

            <div className={containerClass}>
                <div className={headerClass}>
                    <span className={iconClass}>
                        <ProductIcon type={iconType} className="w-4 h-4" />
                    </span>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${provider === 'posthog' ? 'text-[#F54E00]' : 'text-slate-600'}`}>
                        {data.category || 'Component'}
                    </span>
                </div>

                <div className="p-3">
                    <div className="font-bold text-slate-900 text-sm">{data.label}</div>

                    {provider !== 'posthog' && data.currentTool && (
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            Using: <span className="font-medium text-slate-700">{data.currentTool}</span>
                        </div>
                    )}

                    {provider === 'posthog' && (
                        <div className="mt-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-800">
                            PostHog Powered
                        </div>
                    )}

                    {data.owner && (
                        <div className="text-[10px] text-slate-400 mt-2 border-t border-slate-100 pt-1">
                            Owner: {data.owner}
                        </div>
                    )}
                </div>

                <Handle
                    type="target"
                    position={Position.Top}
                    className="w-3 h-3 bg-slate-400 border-2 border-white !-top-1.5"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="w-3 h-3 bg-slate-400 border-2 border-white !-bottom-1.5"
                />
            </div>
        </>
    );
};

export default memo(CustomNode);
