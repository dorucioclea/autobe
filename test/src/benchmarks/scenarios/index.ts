import { scenarios as bbsSystemScenarios } from "./bbs-system";
import { scenarios as shoppingScenarios } from "./shopping";
import { IScenario } from "./types";

export const scenarios: IScenario[] = [
  ...bbsSystemScenarios,
  ...shoppingScenarios,
];
