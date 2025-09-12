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
    const getSetTimeout = () => {
      return setTimeout(
        () => {
          chunkTimeoutAbortController.abort();
        },
        3 * 60 * 1000,
      );
    };
    const timeoutPointer: IPointer<NodeJS.Timeout> = {
      value: getSetTimeout(),
    };
    for await (const _chunk of event.stream) {
      if (timeoutPointer.value != null) clearTimeout(timeoutPointer.value);
      timeoutPointer.value = getSetTimeout();
    }
    clearTimeout(timeoutPointer.value);
  });
  return {
    agent,
    chunkTimeoutAbortController,
  };
};
