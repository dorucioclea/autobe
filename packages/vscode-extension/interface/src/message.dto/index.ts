import { IActionToConfig } from "./action-to-config.dto";
import { IRequestConversateChatSession } from "./conversate-chat-session.dto";
import {
  IRequestCreateChatSession,
  IResponseCreateChatSession,
} from "./create-chat-session.dto";
import { IRequestGetConfig, IResponseGetConfig } from "./get-config.dto";
import { IOnEventAutoBe } from "./on-event-auto-be.dto";
import { IOnEventUpdateTokenUsage } from "./on-event-update-token-usage.dto";
import { IOnHistoryAutoBe } from "./on-history-auto-be.dto";
import { IRequestSaveFiles, IResponseSaveFiles } from "./save-files.dto";
import { IRequestSetConfig } from "./set-config.dto";

export * from "./get-config.dto";
export * from "./set-config.dto";
export * from "./create-chat-session.dto";
export * from "./on-history-auto-be.dto";
export * from "./on-event-auto-be.dto";
export * from "./on-event-update-token-usage.dto";
export * from "./conversate-chat-session.dto";
export * from "./action-to-config.dto";
export * from "./save-files.dto";

export type IAutoBeWebviewMessage =
  | IRequestGetConfig
  | IResponseGetConfig
  | IRequestSetConfig
  | IRequestCreateChatSession
  | IResponseCreateChatSession
  | IOnHistoryAutoBe
  | IOnEventAutoBe
  | IOnEventUpdateTokenUsage
  | IRequestConversateChatSession
  | IActionToConfig
  | IRequestSaveFiles
  | IResponseSaveFiles;
