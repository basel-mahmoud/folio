import { View, type ViewProps } from "react-native";

/** Horizontal flex helper. */
export function Row({
  style,
  gap,
  align = "center",
  justify = "flex-start",
  wrap = false,
  ...rest
}: ViewProps & {
  gap?: number;
  align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  wrap?: boolean;
}) {
  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: "row",
          alignItems: align,
          justifyContent: justify,
          gap,
          flexWrap: wrap ? "wrap" : "nowrap",
        },
        style,
      ]}
    />
  );
}
