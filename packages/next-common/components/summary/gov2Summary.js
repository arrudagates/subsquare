import Summary from "next-common/components/summary/v2/base";
import { SummaryGreyText } from "next-common/components/summary/styled";

export default function Gov2Summary({ summary }) {
  return (
    <Summary
      items={[
        {
          title: "Confirming",
          content: <span>{summary.confirmingCount || 0}</span>,
        },
        {
          title: "Deciding",
          content: <span>{summary.decidingCount || 0}</span>,
        },
        {
          title: "Active",
          content: (
            <span>
              {summary.activeCount || 0}
              <SummaryGreyText> / {summary.total || 0}</SummaryGreyText>
            </span>
          ),
        },
      ]}
    />
  );
}
