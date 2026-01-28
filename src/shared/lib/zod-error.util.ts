import { z, ZodError } from "zod";

type ZodErrorTree = {
  errors?: string[];
  properties?: Record<string, ZodErrorTree>;
};

export function zodErrorsToFieldErrors(
  error: ZodError,
): Record<string, string[]> {
  const tree = z.treeifyError(error) as ZodErrorTree;

  const fieldErrors: Record<string, string[]> = {};

  if (!tree.properties) return fieldErrors;

  for (const [field, node] of Object.entries(tree.properties ?? {})) {
    if (node?.errors?.length) {
      fieldErrors[field] = node.errors;
    }
  }

  return fieldErrors;
}
