import { AutoBePrismaCompleteEvent } from "@autobe/interface";

import EventBubble from "../../../common/EventBubble";
import FileList from "../../../common/FileList";
import InfoCard from "../../../common/InfoCard";
import StatusIndicator from "../../../common/StatusIndicator";

interface IPrismaCompleteProps {
  event: AutoBePrismaCompleteEvent;
}

const PrismaComplete = ({ event }: IPrismaCompleteProps) => {
  const schemaFiles = Object.keys(event.schemas || {});

  // 오류 메시지들을 추출
  const errorMessages =
    !event.result.success && event.result.errors
      ? event.result.errors.map((error) => error.message)
      : [];

  return (
    <EventBubble
      iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      title="데이터베이스 설계 완료"
      theme="green"
      timestamp={event.created_at}
    >
      <InfoCard title="검증 결과" theme="green">
        <StatusIndicator
          success={event.result.success}
          successText="검증 성공"
          failureText="검증 실패"
          errorMessage={
            errorMessages.length > 0 ? errorMessages.join(", ") : undefined
          }
        />
      </InfoCard>

      <FileList title="생성된 스키마 파일" files={schemaFiles} theme="green" />

      <InfoCard title="컴파일 결과" theme="green">
        <StatusIndicator
          success={event.compiled.type === "success"}
          successText="컴파일 성공"
          failureText="컴파일 실패"
          errorMessage={
            event.compiled.type === "failure"
              ? "컴파일 중 오류가 발생했습니다."
              : undefined
          }
        />
      </InfoCard>

      <InfoCard title="완료 단계" theme="green">
        데이터베이스 설계가 성공적으로 완료되었습니다.
      </InfoCard>
    </EventBubble>
  );
};

export default PrismaComplete;
