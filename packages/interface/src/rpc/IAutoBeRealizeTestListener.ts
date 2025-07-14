import { IAutoBeRealizeTestOperation } from "../compiler/IAutoBeRealizeTestOperation";

export interface IAutoBeRealizeTestListener {
  onOperation(event: IAutoBeRealizeTestOperation): Promise<void>;
  onReset(): Promise<void>;
}
