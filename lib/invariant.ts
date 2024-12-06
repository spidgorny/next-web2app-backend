const prefix = "Invariant failed";

export function invariant(
  condition: any,
  message?: string | (() => string),
): asserts condition {
  if (condition) {
    return;
  }
  const provided = typeof message === "function" ? message() : message;
  const value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
  throw new Error(value);
}
