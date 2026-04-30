export const downloadCSV = async (
    serviceFn,
    params = {},
    filename = "export.csv",
) => {
    try {
        const res = await serviceFn(params, { isExport: true });

        const blob = new Blob([res], { type: "text/csv" });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (err) {
        return {
            success: false,
            message: err?.message || "Export failed",
        };
    }
};