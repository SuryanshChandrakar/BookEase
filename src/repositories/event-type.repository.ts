import { prisma } from "../config/database.js";
import type{ CreateEventTypeDto, UpdateEventTypeDto } from "../dtos/event-type.dto.js";

export async function findByHostId(hostId: number) {
    const eventTypes = await prisma.eventType.findMany({
        where: {
            hostId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return eventTypes;
}

export async function getById(id: number) {
    const eventType = await prisma.eventType.findUnique({
        where: {
            id
        }
    });
    return eventType;
}

//sepeartly passing host id not part of our DTO.
export async function create(hostId: number, data: CreateEventTypeDto) {
    const eventType = await prisma.eventType.create({
        //unpack the data then attach hostid to it
        //this data is property of prisma .
        data: {
            hostId,
            ...data
        }
    });
    return eventType;
}

export async function update(id: number, data: UpdateEventTypeDto) {
    //here the data is subset of that properties.
    const eventType = await prisma.eventType.update({
        where: { id },
        data: data
    });
    return eventType;
}

export async function remove(id: number) {
    await prisma.eventType.delete({
        where: { id }
    });
}

export async function findByHostAndSlug(hostId: number, slug: string) {
    const eventType = await prisma.eventType.findFirst({
        where: {
            hostId,
            slug
        }
    });
    return eventType;
}
