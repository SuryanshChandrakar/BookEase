import { proxyActivities } from "@temporalio/workflow";

import type * as activities from "../activites/index.js";
import { type RegenerateHostSlotsInput } from "../../services/slot.service.js";


// Create the proxy activites

const { regenerateHostSlotsActivity } = proxyActivities<typeof activities>({
    retry: { maximumAttempts: 3},
    startToCloseTimeout: '10 minutes',
})

export async function regenerateHostSlotsWorkflow(input: RegenerateHostSlotsInput) {
    await regenerateHostSlotsActivity(input);
}