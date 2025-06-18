import {
  IAgenticaController,
  IAgenticaHistoryJson,
  MicroAgentica,
} from "@agentica/core";
import { AutoBeOpenApi } from "@autobe/interface";
import { AutoBeTestPlanEvent } from "@autobe/interface/src/events/AutoBeTestPlanEvent";
import { IAutoBeTestPlan } from "@autobe/interface/src/test/AutoBeTestPlan";
import { ILlmApplication, ILlmSchema } from "@samchon/openapi";
import { IPointer } from "tstl";
import typia from "typia";
import { v4 } from "uuid";

import { AutoBeSystemPromptConstant } from "../../constants/AutoBeSystemPromptConstant";
import { AutoBeContext } from "../../context/AutoBeContext";
import { assertSchemaModel } from "../../context/assertSchemaModel";
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

  const pointer: IPointer<IAutoBeTestPlan.IPlan[]> = {
    value: [],
  };

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
    controllers: [
      createApplication({
        model: ctx.model,
        build: (next) => {
          pointer.value = next.plans;
        },
      }),
    ],
  });
  enforceToolCall(agentica);

  await agentica.conversate(`create test scenarioes.`);
  if (pointer.value.length === 0) {
    throw new Error("Failed to create test plans.");
  }

  return {
    type: "testPlan",
    step: ctx.state().analyze?.step ?? 0,
    plans: pointer.value,
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

function createApplication<Model extends ILlmSchema.Model>(props: {
  model: Model;
  build: (next: IMakePlanProps) => void;
}): IAgenticaController.IClass<Model> {
  assertSchemaModel(props.model);

  const application: ILlmApplication<Model> = collection[
    props.model
  ] as unknown as ILlmApplication<Model>;
  return {
    protocol: "class",
    name: "Make test plans",
    application,
    execute: {
      makePlan: (next) => {
        props.build(next);
      },
    } satisfies IApplication,
  };
}

const claude = typia.llm.application<
  IApplication,
  "claude",
  {
    reference: true;
  }
>();
const collection = {
  chatgpt: typia.llm.application<
    IApplication,
    "chatgpt",
    { reference: true }
  >(),
  claude,
  llama: claude,
  deepseek: claude,
  "3.1": claude,
  "3.0": typia.llm.application<IApplication, "3.0">(),
};

interface IApplication {
  /**
   * Make test plans for the given endpoints.
   *
   * @param props Properties containing the endpoints and test plans.
   */
  makePlan(props: IMakePlanProps): void;
}

interface IMakePlanProps {
  /** Array of test plans. */
  plans: IAutoBeTestPlan.IPlan[];
}
