import { Router } from "express";
import { create, getById, list, remove, update } from "../controllers/event-type.controller.js";
import { createEventTypeSchema, UpdateEventTypeSchema } from "../dtos/event-type.dto.js";
import { requireUserId } from "../middlewares/require-user-id.js";
import { validate } from "../middlewares/validate.js";

export const eventTypeRouter: Router = Router();

eventTypeRouter.use(requireUserId);

eventTypeRouter.get('/', list);
eventTypeRouter.get('/:id', getById);
eventTypeRouter.post('/', validate(createEventTypeSchema), create);
eventTypeRouter.patch('/:id', validate(UpdateEventTypeSchema), update);
eventTypeRouter.delete('/:id', remove);