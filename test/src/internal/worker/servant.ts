import {
  IAutoBeRealizeTestListener,
  IAutoBeRealizeTestOperation,
  IAutoBeRealizeTestResult,
  IAutoBeRealizeTestService,
} from "@autobe/interface";
import { DynamicExecutor } from "@nestia/e2e";
import { Driver, WorkerServer } from "tgrid";

const main = async (): Promise<void> => {
  const worker: WorkerServer<
    null,
    IAutoBeRealizeTestService,
    IAutoBeRealizeTestListener
  > = new WorkerServer();
  const start: Date = new Date();
  const operations: IAutoBeRealizeTestOperation[] = [];
  const listener: Driver<IAutoBeRealizeTestListener> = worker.getDriver();
  await worker.open({
    execute: async (props): Promise<IAutoBeRealizeTestResult> => {
      listener.onReset().catch(() => {});
      await DynamicExecutor.validate({
        prefix: "test",
        location: `${__dirname}/../features`,
        parameters: () => [],
        onComplete: (exec) => {
          const op: IAutoBeRealizeTestOperation = {
            name: exec.name,
            location: exec.location,
            value: exec.value,
            error: exec.error,
            started_at: exec.started_at,
            completed_at: exec.completed_at,
          };
          listener.onOperation(op).catch(() => {});
        },
        simultaneous: props.simultaneous ?? 1,
        extension: "ts",
      });
      return {
        reset: props.reset ?? true,
        simultaneous: props.simultaneous ?? 1,
        operations,
        started_at: start.toISOString(),
        completed_at: new Date().toISOString(),
      };
    },
  });
};
main().catch((error) => {
  console.log(error);
  process.exit(-1);
});
