import { orchestrateTestPlan } from "@autobe/agent/src/orchestrate/test/orchestrateTestPlan";
import { AutoBeEvent } from "@autobe/interface";
import typia from "typia";

import { TestGlobal } from "../../../TestGlobal";
import { prepare_agent_test } from "./prepare_agent_test";

export const validate_agent_test_plan = async (
  _owner: string,
  project: "bbs-backend",
) => {
  if (TestGlobal.env.CHATGPT_API_KEY === undefined) return false;

  const { agent } = await prepare_agent_test(project);

  const events: AutoBeEvent[] = [];
  agent.on("testStart", (event) => {
    events.push(event);
  });
  agent.on("testScenario", (event) => {
    events.push(event);
  });
  agent.on("testComplete", (event) => {
    events.push(event);
  });

  const result = await orchestrateTestPlan(agent.getContext());
  typia.assert(result);
  console.log(JSON.stringify(result, null, 2));
  return result;
};
