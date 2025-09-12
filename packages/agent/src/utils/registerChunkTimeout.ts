import { MicroAgentica } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";
import { IPointer } from "tstl";

export const registerChunkTimeout = <Model extends ILlmSchema.Model>(
  agent: MicroAgentica<Model>,
  options: {
    timeout: number;
    abortController?: AbortController;
  },
) => {
  const chunkTimeoutAbortController =
    options.abortController ?? new AbortController();
  agent.on("response", async (event) => {
    const completed: IPointer<boolean> = { value: false };
    const sleep = setTimeout(() => {
      if (completed.value === true) return;
      try {
        chunkTimeoutAbortController.abort();
      } catch {}
    }, options.timeout);
    event
      .join()
      .catch(() => {})
      .finally(() => {
        completed.value = true;
        clearTimeout(sleep);
      });
  });
  return {
    agent,
    chunkTimeoutAbortController,
  };
};
