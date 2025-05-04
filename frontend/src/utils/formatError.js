export default function formatError(errData) {
    if (!errData) return "Request failed";

    if (errData.message && !errData.response) return errData.message;

    // String already (e.g. "Invalid Credentials")
    if (typeof errData === "string") return errData;

    // Common keys
    if (errData.error) return errData.error;
    if (errData.detail) return errData.detail;

    // Django serializer errors: {field: [msgs]}
    if (typeof errData === "object") {
        return Object.entries(errData)
            .map(
                ([field, msgs]) =>
                    `${field}: ${Array.isArray(msgs) ? msgs.join(" ") : msgs}`
            )
            .join(" | ");
    }

    return "Unexpected error";
}
