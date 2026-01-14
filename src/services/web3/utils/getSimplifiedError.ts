export function getSimplifiedError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;

    // Check for user rejection
    if (
      message.includes("User rejected") ||
      message.includes("User denied") ||
      message.includes("user rejected")
    ) {
      return "Transaction cancelled by user";
    }

    // Check for insufficient funds
    if (message.includes("insufficient funds")) {
      return "Insufficient funds for transaction";
    }

    // Check for network errors
    if (message.includes("network")) {
      return "Network error. Please try again";
    }

    // Check for allowance errors
    if (
      message.includes("allowance") ||
      message.includes("ERC20: insufficient allowance")
    ) {
      return "Insufficient token allowance";
    }

    // Extract first line or first sentence only
    const firstLine = message.split("\n")[0];
    const firstSentence = firstLine.split(".")[0];

    // If still too long, truncate
    if (firstSentence.length > 100) {
      return firstSentence.substring(0, 100) + "...";
    }

    return firstSentence;
  }

  if (typeof error === "string") {
    if (error.length > 100) {
      return error.substring(0, 100) + "...";
    }
    return error;
  }

  return "Transaction failed. Please try again";
}

// Helper to check if error is user rejection
export function isUserRejection(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("User rejected") ||
    message.includes("User denied") ||
    message.includes("user rejected")
  );
}
