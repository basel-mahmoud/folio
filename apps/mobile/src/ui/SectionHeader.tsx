import { View } from "react-native";
import { Row } from "./Row";
import { Text } from "./Text";
import { useTheme } from "@/theme";

/** A mono section marker with an index and optional right-side action. */
export function SectionHeader({
  label,
  index,
  right,
}: {
  label: string;
  index?: string;
  right?: React.ReactNode;
}) {
  const t = useTheme();
  return (
    <Row justify="space-between" style={{ marginBottom: t.space[3] }}>
      <Row gap={t.space[2]}>
        {index ? (
          <Text
            style={{
              fontFamily: t.font.mono.medium,
              fontSize: 11,
              color: t.colors.accent,
              letterSpacing: 0.5,
            }}
          >
            {index}
          </Text>
        ) : null}
        <Text variant="label">{label}</Text>
      </Row>
      {right ? <View>{right}</View> : null}
    </Row>
  );
}
