// to Generate slots you need rules, exceptions event types and bookings all of these things 


import { prisma } from "../config/database.js";
import { DateTime } from "luxon";
import { SLOT_GENERATION_DAYS } from "../config/env.js";
import { findActiveRulesByUser, findExceptionsByUserInRange } from "../repositories/availability.repository.js";
import { findActiveEventTypesByHost } from "../repositories/event-type.repository.js";
import { findBookedSlotsByHostInRange } from "../repositories/slot.repository.js";
import { applyExceptionsForDate, overlapsBooked, splitIntoSlots, type TimeWindow, windowsForWeekdayRule } from "./slot-generation.service.js";

export interface RegenerateHostSlotsInput {
    hostId: number;
    from?: string; // YYYY-MM-DD
    to?: string; // YYYY-MM-DD
}

export async function regenerateHostSlots(input: RegenerateHostSlotsInput) {
    const host = await prisma.user.findUnique({ where: { id: input.hostId } });
    if(!host) return;

    const from = input.from 
        ? DateTime.fromISO(input.from, { zone: 'utc' }).startOf('day') // 2026-06-01 -> 2026-06-01T00:00:00:000Z
        : DateTime.now().startOf('day');

    const to = input.to 
        ? DateTime.fromISO(input.to, { zone: 'utc' }).endOf('day') // 2026-06-01 -> 2026-06-01T23:59:59:999Z
        : from.plus({ days: SLOT_GENERATION_DAYS}).endOf('day');

    
    const [rules, exceptions, eventTypes, bookedSlots] = await Promise.all([
        findActiveRulesByUser(input.hostId),
        findExceptionsByUserInRange(input.hostId, from.toJSDate(), to.toJSDate()),
        findActiveEventTypesByHost(input.hostId),
        findBookedSlotsByHostInRange(input.hostId, from.toJSDate(), to.toJSDate()),
    ]);

    // convert booked slots into time windows -> compatible with luxon
    const bookedWindows: TimeWindow[] = bookedSlots.map((slot) => {
        return {
            start: DateTime.fromJSDate(slot.startAt, { zone: 'utc' }),
            end: DateTime.fromJSDate(slot.endAt, { zone: 'utc' }),
        }
    });

    for(const eventType of eventTypes) {

        for(let cursor = from; cursor <= to; cursor = cursor.plus({ days: 1 })) {
            const dateKey = cursor.toISODate(); // 2026-06-01

            const dayExceptions = exceptions.filter((ex) => DateTime.fromJSDate(ex.date, { zone: 'utc'}).toISODate() === dateKey);
            const dayExceptionsWithTimeZone = dayExceptions.map((ex) => ({
                type: ex.type,
                startTime: ex.startTime,
                endTime: ex.endTime,
                timeZone: ex.timezone,
            }));


            let windows: TimeWindow[] = [];

            // convert rules into time windows -> compatible with luxon
            for(const rule of rules) {
                windows.push(...windowsForWeekdayRule(cursor, rule.weekday, rule.startTime, rule.endTime, rule.timezone));
            }

            // apply exceptions to the windows
            windows = applyExceptionsForDate(cursor, windows, dayExceptionsWithTimeZone);

            const slots = splitIntoSlots(
                windows, // windows on which exceptions are applied
                eventType.durationMinutes,
                eventType.bufferBeforeMinutes,
                eventType.bufferAfterMinutes,
            ).filter(
                (slot) => slot.start > DateTime.utc() && !overlapsBooked(slot, bookedWindows, eventType.bufferBeforeMinutes, eventType.bufferAfterMinutes)
            ); // slots filtered to exclude past slots and slots that overlap with booked slots

            // I dont like this query too much.
            for(const slot of slots) {
                const startAt = slot.start.toUTC().toJSDate();
                const endAt = slot.end.toUTC().toJSDate();

                const key = `${eventType.id}|${startAt.toISOString()}|${endAt.toISOString()}`;


                await prisma.slot.upsert({
                    where: {
                        eventTypeId_startAt_endAt: {
                            eventTypeId: eventType.id,
                            startAt,
                            endAt,
                        }
                    },
                    create: {
                        hostId: input.hostId,
                        eventTypeId: eventType.id,
                        startAt,
                        endAt,
                        status: 'AVAILABLE',
                    },
                    update: {
                        status: 'AVAILABLE',
                    }
                })
            }
        }


    }
   
}