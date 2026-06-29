import axios from "axios";


export const UploadMediaToS3 = async (
    uploadUrl,
    file,
    onProgress,
    signal
) => {
    return axios.put(uploadUrl, file, {
        signal,

        headers: {
            "Content-Type": file.type || "application/octet-stream",
        },
        
        onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;


            const loaded = progressEvent.loaded;
            // const total = progressEvent.total;

            const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );


            onProgress?.(percent, loaded);
        },
    });
};