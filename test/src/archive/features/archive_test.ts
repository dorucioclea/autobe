import { AutoBeTokenUsage } from "@autobe/agent";
import { orchestrateTest } from "@autobe/agent/src/orchestrate/test/orchestrateTest";
import { FileSystemIterator } from "@autobe/filesystem";
import {
  AutoBeAssistantMessageHistory,
  AutoBeEventOfSerializable,
  AutoBeEventSnapshot,
  AutoBeHistory,
  AutoBeTestHistory,
} from "@autobe/interface";
import { TestValidator } from "@nestia/e2e";
import { sleep_for } from "tstl";
import typia from "typia";

import { TestFactory } from "../../TestFactory";
import { TestGlobal } from "../../TestGlobal";
import { prepare_agent_test } from "../../features/test/internal/prepare_agent_test";
import { TestHistory } from "../../internal/TestHistory";
import { TestLogger } from "../../internal/TestLogger";
import { TestProject } from "../../structures/TestProject";

export let archive_test = async (
  factory: TestFactory,
  project: TestProject,
) => {
  if (TestGlobal.env.API_KEY === undefined) return false;

  // PREPARE AGENT
  let { agent, zero } = await prepare_agent_test(factory, project);
  let snapshots: AutoBeEventSnapshot[] = [];
  let start: Date = new Date();
  let listen = (event: AutoBeEventOfSerializable) => {
    if (TestGlobal.archive) TestLogger.event(start, event);
    snapshots.push({
      event,
      tokenUsage: agent.getTokenUsage().toJSON(),
    });
  };
  for (let type of typia.misc.literals<AutoBeEventOfSerializable.Type>())
    agent.on(type, listen);

  const bodyMap: WeakSet<object> = new Set();
  let requestCount: number = 0;
  let responseCount: number = 0;
  agent.on("vendorRequest", (e) => {
    const t1: Date = new Date();
    const time = (prev: Date) =>
      ((new Date().getTime() - prev.getTime()) / 60_000).toLocaleString() +
      " mins";
    console.log(`request: ${time(start)}`);
    console.log(`  - source ${e.source}`);
    console.log(`  - id: ${e.id}`);
    console.log(`  - count: ${++requestCount}`);
    bodyMap.add(e.body);
    void (async () => {
      while (true) {
        await sleep_for(60_000);
        if (bodyMap.has(e.body) === false) break;
        console.log("Request not completed yet", e.source, e.id, time(t1));
      }
    })().catch(() => {});
  });
  agent.on("vendorResponse", async (e) => {
    const t1: Date = new Date();
    const time = (prev: Date) =>
      ((new Date().getTime() - prev.getTime()) / 60_000).toLocaleString() +
      " mins";
    console.log(`response: ${time(start)}`);
    console.log(`  - source ${e.source}`);
    console.log(`  - id: ${e.id}`);
    console.log(`  - count: ${++responseCount} of ${requestCount}`);
    bodyMap.delete(e.body);

    let completed: boolean = false as boolean;
    let chunkCount: number = 0;
    void (async () => {
      for await (const _c of e.stream) {
        ++chunkCount;
      }
    })().catch(() => {});
    void (async () => {
      while (true) {
        await sleep_for(60_000);
        if (completed === true) break;
        console.log(
          "Response streaming not completed yet",
          e.source,
          e.id,
          time(t1),
          "chunk count: " + chunkCount,
        );
      }
    })().catch(() => {});
    await e.join();
    completed = true;
  });

  // DO TEST GENERATION
  let result: AutoBeAssistantMessageHistory | AutoBeTestHistory =
    await orchestrateTest(agent.getContext())({
      reason: "Validate agent test",
    });
  console.log("The test result history", result);
  if (result.type !== "test") throw new Error("Failed to generate test.");

  // REPORT RESULT
  let histories: AutoBeHistory[] = agent.getHistories();
  let model: string = TestGlobal.getVendorModel();
  try {
    await FileSystemIterator.save({
      root: `${TestGlobal.ROOT}/results/${model}/${project}/test`,
      files: {
        ...(await agent.getFiles()),
        "pnpm-workspace.yaml": "",
        "logs/compiled.json": JSON.stringify(result.compiled),
        "logs/snapshots.json": JSON.stringify(snapshots),
        "logs/result.json": JSON.stringify({
          ...result,
          files: undefined,
        }),
        "logs/histories.json": JSON.stringify(histories),
      },
    });
  } catch (error) {
    console.log(error);
  }
  if (TestGlobal.archive)
    await TestHistory.save({
      [`${project}.test.json`]: JSON.stringify(histories),
      [`${project}.test.snapshots.json`]: JSON.stringify(
        snapshots.map((s) => ({
          event: s.event,
          tokenUsage: new AutoBeTokenUsage(s.tokenUsage)
            .increment(zero)
            .toJSON(),
        })),
      ),
    });
  if (result.compiled.type === "failure")
    console.log(result.compiled.diagnostics);
  TestValidator.equals("result", result.compiled.type, "success");
};
