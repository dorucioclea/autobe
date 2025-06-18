import { IAutoBeTestPlan } from "../test/AutoBeTestPlan";
import { AutoBeEventBase } from "./AutoBeEventBase";

export interface AutoBeTestPlanEvent extends AutoBeEventBase<"testPlan"> {
  plans: IAutoBeTestPlan.IPlan[];
  step: number;
}
