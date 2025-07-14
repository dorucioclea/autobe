import {
  IAutoBeRealizeTestListener,
  IAutoBeRealizeTestResult,
  IAutoBeRealizeTestService,
} from "@autobe/interface";
import { TestValidator } from "@nestia/e2e";
import { Driver, WorkerConnector } from "tgrid";
import typia from "typia";

export const test_agent_realize_test_worker = async (): Promise<void> => {
  let reset: boolean = false;
  let operated: boolean = false;

  const worker: WorkerConnector<
    null,
    IAutoBeRealizeTestListener,
    IAutoBeRealizeTestService
  > = new WorkerConnector(null, {
    onOperation: async (op) => {
      typia.assert(op);
      operated = true;
    },
    onReset: async () => {
      reset = true;
    },
  });
  const service: Driver<IAutoBeRealizeTestService> = worker.getDriver();

  await worker.connect(`${__dirname}/../../internal/worker/servant.ts`);
  try {
    const result: IAutoBeRealizeTestResult = await service.execute({
      files: {},
      prisma: {},
      reset: true,
      simultaneous: 1,
    });
    typia.assert(result);
    TestValidator.equals("reset")(reset)(true);
    TestValidator.equals("operated")(operated)(true);
  } catch (error) {
    throw error;
  } finally {
    await worker.close();
  }
};
