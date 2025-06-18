import { IAutoBeTestPlan } from "../test/AutoBeTestPlan";
import { AutoBeEventBase } from "./AutoBeEventBase";

export interface AutoBeTestPlanEvent extends AutoBeEventBase<"testPlan"> {
  planGroups: IAutoBeTestPlan.IPlanGroup[];
  step: number;
}
