import { validate_agent_analyze } from "./internal/validate_agent_analyze";

export const test_agent_analyze_bbs = () =>
  validate_agent_analyze("samchon", "bbs-backend");
