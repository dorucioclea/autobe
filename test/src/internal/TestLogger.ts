import { AutoBeEvent, IAutoBeTokenUsageJson } from "@autobe/interface";
import { sleep_for } from "tstl";
import typia from "typia";

export namespace TestLogger {
  export const event = (start: Date, event: AutoBeEvent): void => {
    // DEFAULT TITLE
    const time = (prev: Date) =>
      ((new Date().getTime() - prev.getTime()) / 60_000).toLocaleString() +
      " mins";
    const content: string[] = [`${event.type}: ${time(start)}`];

    // BASIC TYPES
    if (typia.is<ProgressEvent>(event))
      content.push(`  - progress: (${event.completed} of ${event.total})`);
    if (typia.is<TokenUsageEvent>(event))
      content.push(
        `  - token usage: (input: ${event.tokenUsage.input.total.toLocaleString()}, cached: ${event.tokenUsage.input.cached.toLocaleString()}, output: ${event.tokenUsage.output.total.toLocaleString()})`,
      );
    // SPECIFICATIONS
    if (event.type === "consentFunctionCall")
      content.push(
        `  - consent: ${event.assistantMessage} -> ${event.result?.type === "consent" ? event.result.message : "null"} `,
      );
    else if (event.type === "jsonValidateError")
      content.push(
        "  - typia.validate<T>()",
        `    - source: ${event.source}`,
        ...event.result.errors.map(
          (v) =>
            `    - ${v.path}: ${v.expected} (${JSON.stringify(v.value)}) -> ${JSON.stringify(v.description ?? "no description")}`,
        ),
      );
    else if (event.type === "jsonParseError")
      content.push(`  - invalid json: ${event.errorMessage}`);
    // VENDOR RESPONSE
    else if (event.type === "vendorResponse") {
      content.push(`  - source ${event.source}`);
      content.push(`  - id: ${event.id}`);

      const t1: Date = new Date();
      let completed: boolean = false as boolean;
      let chunkCount: number = 0;
      void (async () => {
        for await (const _c of event.stream) ++chunkCount;
      })().catch(() => {});
      void (async () => {
        while (true) {
          await sleep_for(60_000);
          if (completed === true) break;
          console.log("Response streaming not completed yet");
          console.log(
            [
              `source: ${event.source}`,
              `id: ${event.id}`,
              `elapsed time: ${time(t1)}`,
              `chunk count: ${chunkCount}`,
            ]
              .map((s) => `  - ${s}`)
              .join("\n"),
          );
        }
      })().catch(() => {});
      event.join().then(() => {
        completed = true;
      });
    }
  };
}

interface TokenUsageEvent {
  tokenUsage: IAutoBeTokenUsageJson.IComponent;
}
interface ProgressEvent {
  total: number;
  completed: number;
}
