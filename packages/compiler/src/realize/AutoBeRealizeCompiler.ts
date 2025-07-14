import {
  IAutoBeRealizeCompiler,
  IAutoBeRealizeTestProps,
  IAutoBeRealizeTestResult,
  IAutoBeTypeScriptCompileResult,
} from "@autobe/interface";

import { AutoBeTypeScriptCompiler } from "../AutoBeTypeScriptCompiler";
import { AutoBeCompilerInterfaceTemplate } from "../raw/AutoBeCompilerInterfaceTemplate";
import { AutoBeCompilerRealizeTemplate } from "../raw/AutoBeCompilerRealizeTemplate";
import { AutoBeCompilerTestTemplate } from "../raw/AutoBeCompilerTestTemplate";

export class AutoBeRealizeCompiler implements IAutoBeRealizeCompiler {
  public constructor(private readonly tsc: AutoBeTypeScriptCompiler) {}

  public async test(
    props: IAutoBeRealizeTestProps,
  ): Promise<IAutoBeRealizeTestResult> {
    const result: IAutoBeTypeScriptCompileResult = await this.tsc.compile({
      ...props,
      files: {
        ...props.files,
        ...AutoBeCompilerRealizeTemplate,
      },
    });
    if (result.type !== "success")
      throw new Error("Failed to compile TypeScript files.");
    return null!;
  }

  public async getTemplate(): Promise<Record<string, string>> {
    return {
      ...AutoBeCompilerInterfaceTemplate,
      ...AutoBeCompilerTestTemplate,
      ...AutoBeCompilerRealizeTemplate,
    };
  }
}
