'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function inviteUser(roomId: string, email: string) {
    const session = await auth()
    if (!session?.user?.email) return { error: 'Not authenticated' }

    // Check permissions
    const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: { access: true }
    })

    if (!room) return { error: 'Room not found' }

    const isOwner = room.ownerId === session.user?.id
    const isEditor = room.access.some((a: { userEmail: string, role: string }) => a.userEmail === session.user?.email && a.role === 'editor')

    if (!isOwner && !isEditor) return { error: 'Permission denied' }

    if (email === session.user?.email) return { error: 'Cannot invite yourself' }

    // Check if already invited
    const existing = await prisma.roomAccess.findUnique({
        where: {
            roomId_userEmail: {
                roomId,
                userEmail: email
            }
        }
    })

    if (existing) return { error: 'User already invited' }

    await prisma.roomAccess.create({
        data: {
            roomId,
            userEmail: email,
            role: 'editor'
        }
    })

    revalidatePath(`/${roomId}`)
    return { success: true }
}
