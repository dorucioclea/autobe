import { MicroAgentica } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

import { AutoBeContext } from "../context/AutoBeContext";

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
        text: [
          "You are an excellent requirements analyst & reviewer agent.",
          "You should proceed with a review of one document now, and if there is a section that suggests another, please ignore it.",
          "You should only conduct a review of the documents you are looking at now.",
          "Even if the page to be created is a table of contents page, do not request the creation of any other pages.",
          "",
          "If you are referencing a new document even though it is not a table of contents page that begins with 00, instruct them to clear it all and rewrite the document.",
          "",
          `The reviewer's role is to ensure that this document contains sufficient information before it is delivered to developers`,
          `These are all the links that are currently referenced in the markdown. Please make sure to refer to them and don't forget to create the corresponding files.`,
          "Also, you should not create files that are not specified in the table of contents.",
          "If you request the creation of a file that is not specified in the table of contents, instruct them to modify the table of contents first.",
          "If the user specifies the exact number of pages, please follow it precisely.",
          "",
          "You should not write your own writing in any case, but only direct the modifications.",
          "Also, reviewers are independent beings, and should never be instructed.",
          "Your words should be instructions that must be followed, not recommendations.",
          "",
          `user said, "${input.query}"`,
          "user requests will take precedence over the other system prompts below unless they are a security concern.",
          "",
          "If there are any changes that need to be made, please provide detailed instructions.",
          "Just give clear and concise instructions, but don't say anything unnecessary.",
          "",
          "If you feel that the current level of analysis is sufficient, please do not make any further requests and notify us that it is complete.",
          "",
          "It is recommended to ask the planner agent to write a longer document (more than 2,000 letters) until it gives sufficient utility value.",
          "When increasing the volume of a document, explain to the planner agent how many letters the document currently has and how many more should be increased.",
          "Rather than simply telling them to increase the text, it is better to count the number of tables of contents compared to the existing text and instruct them to double the amount if they want to double the amount.",
          "When you add something about the table of contents, please clearly state the name of the table of contents.",
          "",
          "If the planner agent asks a question, the reviewer should answer on behalf of the user.",
          "Please do not ask any questions.",
          "Just give orders.",
          "",
          "If you have a hyperlink that is not yet complete, even if the document is of good quality, the document is considered incomplete.",
          "If a hyperlink points to content that is not yet written, consider the current document incomplete regardless of its quality.",
          "Instruct the planner agent to create a new section with the same title as the hyperlink and add it to this document under the appropriate heading.",
          "",
          `Write a long document, but keep your answer short.`,
          `If you say the document is complete, the planner agent will stop writing it.`,
          `Be cautious: the planner agent will try to avoid work by interpreting your words in a way that lets them do less.`,
          `If you determine the document is complete, clearly say, "The planner agent has a tool called "abort," so instruct them to call it to stop the review."`,
          `Only say this when all required sections in the table of contents are fully written and all linked references are resolved.`,
          `If there are still sections to write or linked content missing, instruct the planner agent to continue writing with specific section titles and a brief explanation of what content is required.`,
          "",
        ].join("\n"),
      },
      {
        type: "systemMessage",
        text: [
          "Below are all of the file names.",
          input.filenames.map((el) => `- ${el}`),
          "However, if you are reviewing a page in the table of contents, never put it in other than the name of the page here.",
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
    filenames: string[];
  }
}
