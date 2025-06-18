import { IAgenticaHistoryJson, MicroAgentica } from "@agentica/core";
import { AutoBeOpenApi } from "@autobe/interface";
import { AutoBeTestPlanEvent } from "@autobe/interface/src/events/AutoBeTestPlanEvent";
import { ILlmSchema } from "@samchon/openapi";
import { v4 } from "uuid";

import { AutoBeSystemPromptConstant } from "../../constants/AutoBeSystemPromptConstant";
import { AutoBeContext } from "../../context/AutoBeContext";
import { enforceToolCall } from "../../utils/enforceToolCall";

export async function orchestrateTestPlan<Model extends ILlmSchema.Model>(
  ctx: AutoBeContext<Model>,
): Promise<AutoBeTestPlanEvent> {
  const operations = ctx.state().interface?.document.operations ?? [];
  if (operations.length === 0) {
    throw new Error(
      "Cannot write test scenarios because these are no operations.",
    );
  }

  const agentica: MicroAgentica<Model> = new MicroAgentica({
    model: ctx.model,
    vendor: ctx.vendor,
    config: {
      ...(ctx.config ?? {}),
      executor: {
        describe: null,
      },
    },
    histories: createHistoryProperties(operations),
    controllers: [],
  });
  enforceToolCall(agentica);

  const response = await agentica.conversate(`create test scenarioes.`);
  return {
    type: "testPlan",
    step: ctx.state().analyze ?? 0,
    plans: [],
    created_at: new Date().toISOString(),
  } as AutoBeTestPlanEvent;
}

const createHistoryProperties = (operations: AutoBeOpenApi.IOperation[]) => [
  {
    id: v4(),
    created_at: new Date().toISOString(),
    type: "systemMessage",
    text: AutoBeSystemPromptConstant.TEST_PLAN,
  } satisfies IAgenticaHistoryJson.ISystemMessage,
  {
    id: v4(),
    created_at: new Date().toISOString(),
    type: "systemMessage",
    text: [
      "Below are the full operations. Please refer to this.",
      "```json",
      JSON.stringify(operations),
      "```",
    ].join("\n"),
  } satisfies IAgenticaHistoryJson.ISystemMessage,
];
