export function formatDateLong(dateStr) {
    const date = new Date(dateStr);

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
    };

    return date.toLocaleDateString("id-ID", options);
}
