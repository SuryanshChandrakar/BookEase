import { prisma } from "../config/database.js";
import { type CreateBookingDto } from "../dtos/booking.dto.js";
import { badRequest, notFound } from "../utils/api-error.js";

export async function createBookingOptimistically(userId: number, dto: CreateBookingDto) {

    const booking = await prisma.$transaction(
        async (tx) => {
            const slot = await tx.slot.findUnique({
                where: {
                    id: dto.slotId
                }
            });

            if(!slot) {
                throw notFound('Slot not found');
            }

            if(slot.status !== 'AVAILABLE') {
                throw badRequest('Slot is not available');
            }

            if(slot.startAt <= new Date()) {
                throw badRequest('Slot has already started');
            }

            const updated = await tx.slot.updateMany({
                where: {
                    id: dto.slotId,
                    status: 'AVAILABLE'
                },
                data: {
                    status: 'BOOKED'
                }
            });

            if(updated.count !== 1) {
                throw badRequest('Slot is not available');
            }

            return tx.booking.create({
                data: {
                    slotId: dto.slotId,
                    inviteeEmail: dto.inviteeEmail,
                    inviteeName: dto.inviteeName,
                    inviteeNotes: dto.inviteeNotes,
                    status: 'CONFIRMED',
                    hostId: userId,
                    eventTypeId: slot.eventTypeId,
                },
                include: {
                    slot: true,
                }
            })
        }
    );

    return {
        booking: {
            id: booking.id,
            status: booking.status,
            startAt: booking.slot.startAt.toISOString(),
            endAt: booking.slot.endAt.toISOString(),
        }
    }
}

export async function createBookingPessimistically(userId: number, dto: CreateBookingDto) {

    const booking = await prisma.$transaction(
        async (tx) => {

            //acquiring phase of lock
            const locked = await tx.$queryRaw<{ id: string }[]>`
                SELECT id
                FROM slots
                WHERE id = ${dto.slotId}
                FOR UPDATE
            `;

            if (locked.length === 0) {
                throw notFound('Slot not found');
            }

            const slot = await tx.slot.findUnique({
                where: {
                    id: dto.slotId
                }
            });

            if (!slot) {
                throw notFound('Slot not found');
            }

            if (slot.status !== 'AVAILABLE') {
                throw badRequest('Slot is not available');
            }

            if (slot.startAt <= new Date()) {
                throw badRequest('Slot has already started');
            }

            await tx.slot.update({
                where: {
                    id: dto.slotId
                },
                data: {
                    status: 'BOOKED'
                }
            });

            return tx.booking.create({
                data: {
                    slotId: dto.slotId,
                    inviteeEmail: dto.inviteeEmail,
                    inviteeName: dto.inviteeName,
                    inviteeNotes: dto.inviteeNotes,
                    status: 'CONFIRMED',
                    hostId: userId,
                    eventTypeId: slot.eventTypeId,
                },
                include: {
                    slot: true,
                }
            })
        }
    );

    return {
        booking: {
            id: booking.id,
            status: booking.status,
            startAt: booking.slot.startAt.toISOString(),
            endAt: booking.slot.endAt.toISOString(),
        }
    }
}