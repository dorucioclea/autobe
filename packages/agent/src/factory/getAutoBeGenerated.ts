import { AutoBeHistory, IAutoBeGetFilesOptions } from "@autobe/interface";
import { ILlmSchema } from "@samchon/openapi";
import typia from "typia";

import { AutoBeContext } from "../context/AutoBeContext";
import { AutoBeState } from "../context/AutoBeState";
import { AutoBeTokenUsage } from "../context/AutoBeTokenUsage";

export async function getAutoBeGenerated<Model extends ILlmSchema.Model>(
  ctx: AutoBeContext<Model>,
  histories: AutoBeHistory[],
  tokenUsage: AutoBeTokenUsage,
  options?: Partial<IAutoBeGetFilesOptions>,
): Promise<Record<string, string>> {
  const state: AutoBeState = ctx.state();
  const ret: Record<string, string> = {};

  // ANALYZE
  if (state.analyze === null) return {};
  Object.assign(
    ret,
    Object.fromEntries(
      Object.entries(state.analyze.files).map(([key, value]) => [
        `docs/analysis/${key.split("/").at(-1)}`,
        value,
      ]),
    ),
  );

  // PRISMA
  if (state.prisma?.step === state.analyze.step) {
    const schemaFiles: Record<string, string> =
      (options?.dbms ?? "postgres") === "postgres"
        ? state.prisma.schemas
        : await ctx.compiler.prisma.write(
            state.prisma.result.data,
            options!.dbms!,
          );
    Object.assign(
      ret,
      Object.fromEntries(
        Object.entries(schemaFiles).map(([key, value]) => [
          `prisma/schema/${key.split("/").at(-1)}`,
          value,
        ]),
      ),
    );
    if (state.prisma.compiled.type === "success")
      ret["docs/ERD.md"] = state.prisma.compiled.document;
    else if (state.prisma.compiled.type === "failure")
      ret["prisma/compile-error-reason.log"] = state.prisma.compiled.reason;
    ret["autobe/prisma.json"] = typia.json.stringify(state.prisma.result);
  }

  // INTERFACE
  if (state.interface?.step === state.analyze.step) {
    Object.assign(
      ret,
      state.test?.step === state.interface.step
        ? Object.fromEntries(
            Object.entries(state.interface.files).filter(
              ([key]) => key.startsWith("test/features/") === false,
            ),
          )
        : state.interface.files,
    );
    ret["autobe/document.json"] = typia.json.stringify(
      state.interface.document,
    );
  }

  // TEST
  if (state.test?.step === state.analyze.step) {
    Object.assign(ret, state.test.files);
    Object.assign(ret, await ctx.compiler.realize.getTemplate());
  }

  // REALIZE
  if (state.realize?.step === state.analyze.step)
    Object.assign(ret, state.realize.files);

  // LOGGING
  Object.assign(ret, {
    "autobe/histories.json": typia.json.stringify(histories),
    "autobe/tokenUsage.json": typia.json.stringify(tokenUsage),
  });
  return ret;
}
