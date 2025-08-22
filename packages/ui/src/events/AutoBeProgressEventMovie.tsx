import { AutoBeEvent, AutoBeProgressEventBase } from "@autobe/interface";

import { formatTime } from "../utils/time";

export function AutoBeProgressEventMovie(
  props: AutoBeProgressEventMovie.IProps,
) {
  const state: IState = getState(props.event);

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        marginBottom: "1rem",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          {/* Status Icon */}
          <div
            style={{
              width: "2rem",
              height: "2rem",
              backgroundColor: "#4caf50",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: "#ffffff" }}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#1e293b",
                margin: 0,
                marginBottom: "0.25rem",
              }}
            >
              {state.title}
            </h3>
          </div>
        </div>

        {/* Timestamp */}
        <div
          style={{
            fontSize: "0.75rem",
            color: "#64748b",
            textAlign: "right",
          }}
        >
          {formatTime(props.event.created_at)}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          fontSize: "0.875rem",
          lineHeight: "1.5",
          color: "#475569",
          backgroundColor: "#ffffff",
          padding: "1rem",
          borderRadius: "0.5rem",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>{state.description}</div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "10px",
            backgroundColor: "#e2e8f0",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: `${Math.round((state.completed / state.total) * 100)}%`,
              height: "100%",
              backgroundColor: "#4caf50",
              borderRadius: "10px",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <div
          style={{
            fontSize: "0.75rem",
            color: "#64748b",
            textAlign: "center",
          }}
        >
          {state.completed} / {state.total} completed
        </div>
      </div>
    </div>
  );
}
type ExtractType<T, U> = T extends U ? T : never;

export namespace AutoBeProgressEventMovie {
  export interface IProps {
    event: ExtractType<AutoBeEvent, AutoBeProgressEventBase>;
  }
}

interface IState {
  title: string;
  description: string;
  completed: number;
  total: number;
}

function getState(event: AutoBeProgressEventMovie.IProps["event"]): IState {
  const content: Pick<IState, "title" | "description"> = (() => {
    switch (event.type) {
      case "analyzeWrite":
        return {
          title: "Analyze Write",
          description: "Analyzing requirements, and writing a report paper",
        };
      case "analyzeReview":
        return {
          title: "Analyze Review",
          description: "Reviewing the analysis results",
        };
      case "prismaSchemas":
        return {
          title: "Prisma Schemas",
          description: "Designing Database schemas",
        };
      case "prismaReview":
        return {
          title: "Prisma Review",
          description: "Reviewing the Prisma schemas",
        };
      case "interfaceEndpoints":
        return {
          title: "Interface Endpoints",
          description: "Collecting API endpoints",
        };
      case "interfaceOperations":
        return {
          title: "Interface Operations",
          description: "Designing API operations",
        };
      case "interfaceOperationsReview":
        return {
          title: "Interface Operations Review",
          description: "Reviewing API operations",
        };
      case "interfaceAuthorization":
        return {
          title: "Interface Authorization",
          description: "Designing API authorization operations",
        };
      case "interfaceSchemas":
        return {
          title: "Interface Schemas",
          description: "Designing API type schemas",
        };
      case "interfaceSchemasReview":
        return {
          title: "Interface Schemas Review",
          description: "Reviewing API type schemas",
        };
      case "testScenarios":
        return {
          title: "Test Scenarios",
          description: "Planning E2E test scenarios",
        };
      case "testWrite":
        return {
          title: "Test Write",
          description: "Writing E2E test functions",
        };
      case "realizeWrite":
        return {
          title: "Realize Write",
          description: "Realizing the API functions",
        };
      case "realizeAuthorizationWrite":
        return {
          title: "Authorization Write",
          description: "Writing authorization decorators and functions",
        };
      case "realizeTestOperation":
        return {
          title: "Realize Test Operation",
          description:
            "Running the E2E test operations to validate the API functions",
        };
      case "realizeCorrect":
        return {
          title: "Realize Correct",
          description: "Correcting the API functions",
        };
      default:
        event satisfies never;
        return {
          title: "Unknown Event",
          description: "This event type is not recognized.",
        };
    }
  })();
  return {
    ...content,
    completed: event.completed,
    total: event.total,
  };
}
export default AutoBeProgressEventMovie;
