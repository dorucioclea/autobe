import { IAgenticaHistoryJson, MicroAgentica } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";
import { v4 } from "uuid";

import { AutoBeSystemPromptConstant } from "../../constants/AutoBeSystemPromptConstant";
import { AutoBeContext } from "../../context/AutoBeContext";
import { enforceToolCall } from "../../utils/enforceToolCall";

export async function orchestrateTestPlan<Model extends ILlmSchema.Model>(
  ctx: AutoBeContext<Model>,
) {
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
    histories: [createHistoryProperties()],
    controllers: [],
  });
  enforceToolCall(agentica);

  const response = await agentica.conversate(`create test scenarioes.`);
}

const createHistoryProperties = () =>
  ({
    id: v4(),
    created_at: new Date().toISOString(),
    type: "systemMessage",
    text: AutoBeSystemPromptConstant.TEST_PLAN,
  }) satisfies IAgenticaHistoryJson.ISystemMessage;
