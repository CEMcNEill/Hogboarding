import Sidebar from '@/components/Sidebar';
import FlowWithProvider from '@/components/Flow';

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;
    return (
        <main className="flex h-screen w-screen overflow-hidden bg-white">
            <Sidebar />
            <FlowWithProvider roomId={roomId} />
        </main>
    );
}
