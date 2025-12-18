import Sidebar from '@/components/Sidebar';
import FlowWithProvider from '@/components/Flow';

import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;

    // Check if Auth is enabled (default: true)
    if (process.env.NEXT_PUBLIC_ENABLE_AUTH !== 'false') {
        const session = await auth();
        if (!session?.user?.email) {
            return signIn();
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: { access: true }
        });

        if (!room) {
            // Create new room
            await prisma.room.create({
                data: {
                    id: roomId,
                    ownerId: session.user.id!,
                    access: {
                        create: {
                            userEmail: session.user.email,
                            role: 'owner'
                        }
                    }
                }
            });
        } else {
            // Check access
            // Uses optional chaining in case session user id is missing, though email check above helps
            const isOwner = room.ownerId === session.user?.id;
            const hasAccess = isOwner || room.access.some((a: { userEmail: string }) => a.userEmail === session.user?.email);

            if (!hasAccess) {
                return (
                    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
                        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-slate-200">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
                            <p className="text-slate-500 mb-6">You do not have permission to view this board.</p>
                            <div className="flex gap-2 justify-center">
                                <form action={async () => {
                                    "use server";
                                    await signIn();
                                }}>
                                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium text-sm">
                                        Switch Account
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            }
        }
    }

    return (
        <main className="flex h-screen w-screen overflow-hidden bg-white">
            <Sidebar roomId={roomId} />
            <FlowWithProvider roomId={roomId} />
        </main>
    );
}
