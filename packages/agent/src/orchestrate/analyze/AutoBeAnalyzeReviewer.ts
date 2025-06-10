import { MicroAgentica } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

import { AutoBeSystemPromptConstant } from "../../constants/AutoBeSystemPromptConstant";
import { AutoBeContext } from "../../context/AutoBeContext";

export const AutoBeAnalyzeReviewer = <Model extends ILlmSchema.Model>(
  ctx: AutoBeContext<Model>,
  input: AutoBeAnalyzeReviewer.ICreateReviewerAgentInput,
) => {
  const agent = new MicroAgentica({
    model: ctx.model,
    vendor: ctx.vendor,
    controllers: [],
    config: {
      systemPrompt: {
        describe: () => {
          return "Answer only 'completion' or 'failure'.";
        },
      },
      locale: ctx.config?.locale,
    },
    histories: [
      ...ctx
        .histories()
        .filter(
          (el) => el.type === "assistantMessage" || el.type === "userMessage",
        ),
      {
        type: "systemMessage",
        text: AutoBeSystemPromptConstant.ANALYZE_REVIEWER,
      },
      {
        type: "systemMessage",
        text: [
          "Below are all of the files.",
          "```json",
          input.files,
          "```",
        ].join("\n"),
      },
    ],
    tokenUsage: ctx.usage(),
  });

  return agent;
};

export namespace AutoBeAnalyzeReviewer {
  export interface ICreateReviewerAgentInput {
    /**
     * Indicates the initial utterance of the user. Identify the purpose of your
     * documentation for better review.
     */
    query: string;

    /** Total file names */
    files: string;
  }
}
