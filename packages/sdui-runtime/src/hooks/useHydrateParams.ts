import { useMemo } from "react";

/**
 * Hydrates template parameters in BFF endpoint URLs and payloads.
 * Replaces `{param}` placeholders with values from the params map.
 * Ported 1:1 from legacy — used by action engine bff_call handler.
 *
 * @example
 * const url = useHydrateParams("/v1/creator/campaigns/{id}", { id: "123" });
 * // "/v1/creator/campaigns/123"
 */
export function useHydrateParams(
  template: string,
  params: Record<string, string>,
): string {
  return useMemo(() => {
    let result = template;
    for (const [key, value] of Object.entries(params)) {
      result = result.replaceAll(`{${key}}`, value);
    }
    return result;
  }, [template, params]);
}
