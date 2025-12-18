'use client';

import React, { useState } from 'react';
import { X, Mail, UserPlus, Check, AlertCircle } from 'lucide-react';
import { inviteUser } from '@/app/actions';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
}

export default function InviteModal({ isOpen, onClose, roomId }: InviteModalProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const result = await inviteUser(roomId, email);
            if (result.error) {
                setStatus('error');
                setMessage(result.error);
            } else {
                setStatus('success');
                setMessage('Added to board! Opening email draft...');

                // Construct mailto link
                const subject = encodeURIComponent("Join me on HogBoard");
                const body = encodeURIComponent(`I've invited you to collaborate on this board:\n${window.location.origin}/${roomId}`);
                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

                const currentEmail = email; // Capture for closure
                setEmail('');

                setTimeout(() => {
                    setStatus('idle');
                    setMessage('');
                    onClose();
                }, 2000);
            }
        } catch (err) {
            setStatus('error');
            setMessage('Failed to send invitation');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-slate-500" />
                        Invite Team Member
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 hover:text-slate-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleInvite} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                                    placeholder="colleague@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {message}
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Invite'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
