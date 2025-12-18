import React, { memo, useState } from 'react';
import { NodeProps, NodeToolbar, Position, Handle, NodeResizer } from 'reactflow';
import useStore from '../store';
import { Trash2, Pencil, X, Check } from 'lucide-react';

const COLORS = {
    yellow: 'bg-yellow-100 border-yellow-200 text-yellow-900',
    blue: 'bg-blue-100 border-blue-200 text-blue-900',
    pink: 'bg-pink-100 border-pink-200 text-pink-900',
    green: 'bg-green-100 border-green-200 text-green-900',
};

const AnnotationNode = ({ id, data, selected }: NodeProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const updateNodeData = useStore((state) => state.updateNodeData);
    const deleteNode = useStore((state) => state.deleteNode);

    const color = data.color || 'yellow';
    const colorClass = COLORS[color as keyof typeof COLORS] || COLORS.yellow;

    return (
        <>
            <NodeResizer minWidth={100} minHeight={100} isVisible={selected} />
            <NodeToolbar isVisible={isEditing} position={Position.Top} className="flex gap-2 p-2 bg-white rounded-lg shadow-2xl border border-slate-300 ring-1 ring-slate-100 items-center">
                <button
                    onClick={() => setIsEditing(false)}
                    className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 mr-2"
                >
                    <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex gap-1 mr-2">
                    {Object.keys(COLORS).map((c) => (
                        <button
                            key={c}
                            onClick={() => updateNodeData(id, { color: c })}
                            className={`w-5 h-5 rounded-full border border-slate-300 ${COLORS[c as keyof typeof COLORS]} ${color === c ? 'ring-2 ring-slate-400 ring-offset-1' : ''}`}
                            title={c}
                        />
                    ))}
                </div>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button onClick={() => deleteNode(id)} className="text-red-600 hover:bg-red-50 hover:text-red-700 p-1.5 rounded border border-transparent hover:border-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </NodeToolbar>

            <div className={`rounded-lg shadow-md border ${colorClass} w-full h-full relative group transition-all flex flex-col`}>
                <div className="p-4 w-full h-full overflow-y-auto break-words">
                    {isEditing ? (
                        <textarea
                            className="w-full h-full bg-transparent resize-none outline-none font-medium"
                            value={data.label}
                            onChange={(e) => updateNodeData(id, { label: e.target.value })}
                            placeholder="Type your note..."
                            autoFocus
                        />
                    ) : (
                        <div className="font-medium whitespace-pre-wrap">
                            {data.label || <span className="text-opacity-50 italic">Empty note...</span>}
                        </div>
                    )}
                </div>

                {/* Edit Trigger */}
                {!isEditing && (
                    <button
                        className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-black/5 text-current opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                )}

                <Handle type="target" position={Position.Top} className="opacity-0" />
                <Handle type="source" position={Position.Bottom} className="opacity-0" />
            </div>
        </>
    );
};

export default memo(AnnotationNode);
