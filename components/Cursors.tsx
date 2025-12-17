import React from 'react';
import useStore from '../store';

const COLORS = ['#dc2626', '#d97706', '#059669', '#2563eb', '#db2777'];

export default function Cursors() {
    const others = useStore((state) => state.liveblocks.others);

    return (
        <>
            {others.map(({ connectionId, presence }) => {
                if (!presence || !presence.cursor) {
                    return null;
                }

                const { x, y } = presence.cursor as { x: number; y: number };
                const color = COLORS[connectionId % COLORS.length];

                return (
                    <div
                        key={connectionId}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            transform: `translateX(${x}px) translateY(${y}px)`,
                            pointerEvents: 'none',
                            zIndex: 1000,
                        }}
                    >
                        <svg
                            width="24"
                            height="36"
                            viewBox="0 0 24 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                                fill={color}
                                stroke="white"
                            />
                        </svg>
                        <div
                            style={{
                                backgroundColor: color,
                                borderRadius: 4,
                                color: 'white',
                                fontSize: 10,
                                padding: '2px 4px',
                                marginTop: 4,
                                width: 'max-content',
                            }}
                        >
                            User {connectionId}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
