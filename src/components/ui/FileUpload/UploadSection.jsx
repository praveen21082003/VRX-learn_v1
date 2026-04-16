import React from 'react';
import { Icon, ProgressBar } from '@/components/ui'
import DropZone from "./DropZone";
// import UploadButton from "./UploadButton";
import { motion, warning } from "motion/react";

const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
};

const UploadProgress = React.memo(({ progress }) => (
    <ProgressBar
        percent={progress}
        hClass="h-1.5"
        bgClass="bg-primary"
    />
));

const FileItem = React.memo(({ file, index, isUploading, uploadProgress, loadedData, mediaStatus, handleRemoveFile }) => {
    const fileSize =
        file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`;

    return (
        <div
            className="group flex items-center bg-background justify-between p-3 border border-gray-200 rounded shadow-sm hover:border-primary/40 dark:hover:border-text-main-dark transition-colors"
        >
            <div className="flex items-center gap-3 w-full">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 text-primary dark:text-text-main-dark rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon
                        name="bi:file-earmark-text"
                        height="24px"
                        width="24px"
                    />
                </div>

                <div className="flex flex-col min-w-0 w-full">
                    <span className="text-h5 font-medium text-muted truncate">
                        {file.name}
                    </span>

                    {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
                        <UploadProgress progress={uploadProgress} />
                    )}

                    <div className="text-xs text-muted mt-1 flex items-center gap-2">
                        <span className="text-dark-gray">
                            {isUploading && loadedData
                                ? `${formatBytes(loadedData)} of `
                                : ""}
                            {fileSize}
                        </span>

                        {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
                            <>
                                <Icon name="ph:dot-bold" />
                                <span>Uploading...</span>
                            </>
                        )}

                        {!isUploading && mediaStatus === "processing" && (
                            <span>Creating Lesson...</span>
                        )}

                        {mediaStatus === "uploaded" && (
                            <div className="flex items-center gap-1 text-primary text-body">
                                <Icon name="mdi:checkbox-marked-circle" height="18" width="18" />
                                <span>Upload Complete</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={() => handleRemoveFile(index)}
                className="hover:bg-primary/80 hover:text-white p-1 rounded-full text-primary dark:text-text-main-dark transition-colors"
            >
                <Icon
                    name="material-symbols:close-rounded"
                    height="30"
                    width="30"
                />
            </button>
        </div>
    );
});

const UploadedFiles = React.memo(({ files, isUploading, uploadProgress, loadedData, mediaStatus, handleRemoveFile }) => {
    return (
        <div className="grid grid-cols-1 gap-2">
            {files.map((file, index) => (
                <FileItem
                    key={file.lastModified}
                    file={file}
                    index={index}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    loadedData={loadedData}
                    mediaStatus={mediaStatus}
                    handleRemoveFile={handleRemoveFile}
                />
            ))}
        </div>
    );
});

export default function UploadSection({
    files,
    setFiles,
    uploadProgress = 0,
    isUploading = false,
    mediaStatus,
    label = "Your Work",
    optional,
    loadedData,
    inputWarning
}) {

    console.log(inputWarning);
    const handleRemoveFile = React.useCallback((indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
    }, [files, setFiles]);

    return (
        <>
            <div className="hidden lg:block">
                <DropZone
                    label={label}
                    optional={optional}
                    files={files}
                    multipleFiles={false}
                    onFilesChange={setFiles}
                    heightClass="h-74"
                    handleRemoveFile
                    UploadedFiles={
                        <UploadedFiles
                            files={files}
                            isUploading={isUploading}
                            uploadProgress={uploadProgress}
                            loadedData={loadedData}
                            mediaStatus={mediaStatus}
                            handleRemoveFile={handleRemoveFile}
                        />
                    }
                    inputWarning={inputWarning}
                />
            </div>

            <motion.div
                initial={{ y: 0 }}
                animate={isUploading ? false : { y: 0 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-background overflow-hidden rounded-t-2xl shadow-lg z-40"
            >
                <div className='bg-primary-16 p-3'>
                    <p className="text-h5 font-medium mb-2">{label}</p>

                    {files.length === 0 ? (
                        <label className="block border border-primary dark:bg-primary rounded-md text-center py-2 cursor-pointer">
                            + Add File
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setFiles([...e.target.files])}
                            />
                        </label>
                    ) : (
                        <UploadedFiles
                            files={files}
                            isUploading={isUploading}
                            uploadProgress={uploadProgress}
                            loadedData={loadedData}
                            mediaStatus={mediaStatus}
                            handleRemoveFile={handleRemoveFile}
                        />
                    )}
                </div>
            </motion.div>
        </>
    );
}