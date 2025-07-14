import { TestValidator } from "@nestia/e2e";

export const test_sum = (): void => {
  TestValidator.equals("sum")(1 + 2)(3);
};
