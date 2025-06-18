import { AutoBeOpenApi } from "../openapi";

export namespace IAutoBeTestPlan {
  /** Test plans grouped by endpoint */
  export interface IPlanGroup extends AutoBeOpenApi.IEndpoint {
    /** Array of test plans. */
    plans: IAutoBeTestPlan.IPlan[];
  }

  /**
   * Represents a test plan for a single API operation.
   *
   * This interface extends `AutoBeOpenApi.IEndpoint`, inheriting its HTTP
   * method and path information, and adds two key properties:
   *
   * - `draft`: A free-form, human-readable test scenario description for the API
   *   endpoint.
   * - `dependsOn`: A list of other API endpoints that must be invoked beforehand
   *   in order to prepare the context for this test. Each dependency includes
   *   the purpose of the dependency.
   *
   * This structure is intended to help organize test specifications for complex
   * workflows and ensure that all prerequisites are explicitly declared.
   */
  export interface IPlan {
    /**
     * A detailed natural language description of how this API endpoint should
     * be tested. This should include both successful and failure scenarios,
     * business rule validations, edge cases, and any sequence of steps
     * necessary to perform the test.
     */
    draft: string;

    /**
     * A list of other API endpoints that must be executed before this test
     * scenario. This helps express dependencies such as data creation or
     * authentication steps required to reach the intended test state.
     */
    dependsOn: IDependsOn[];
  }

  /**
   * Represents a dependent API operation required to set up the test context
   * for a primary API test plan.
   *
   * This interface also extends `AutoBeOpenApi.IEndpoint`, including `method`
   * and `path`, and adds a `purpose` field to clearly explain why this
   * dependency is necessary.
   */
  export interface IDependsOn extends AutoBeOpenApi.IEndpoint {
    /**
     * A concise explanation of why this API call is required before executing
     * the test for the main operation.
     *
     * Example: "Creates a category so that a product can be linked to it during
     * creation."
     */
    purpose: string;
  }
}
