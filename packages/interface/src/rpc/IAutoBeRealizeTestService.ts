import { IAutoBeRealizeTestProps } from "../compiler/IAutoBeRealizeTestProps";
import { IAutoBeRealizeTestResult } from "../compiler/IAutoBeRealizeTestResult";

export interface IAutoBeRealizeTestService {
  execute(props: IAutoBeRealizeTestProps): Promise<IAutoBeRealizeTestResult>;
}
