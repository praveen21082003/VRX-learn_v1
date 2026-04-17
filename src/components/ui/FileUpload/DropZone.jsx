import { useDropzone } from "react-dropzone";
import { Icon, InputWarnMessage } from "@/components/ui";




export default function DropZone({ label, optional, files, multipleFiles = false, maxFilesAllowed = 1, onFilesChange, heightClass, UploadedFiles, inputWarning, maxFileSize = 5, allowedTypes , }) {



  // MIME_MAP is used to convert file extensions to MIME types for the accept prop of useDropzone.
  // This ensures that when we say we accept "pdf", it correctly translates to "application/pdf" for the file input.
  const MIME_MAP = {
    pdf: { "application/pdf": [".pdf"] },
    mp4: { "video/mp4": [".mp4"] },
    png: { "image/png": [".png"] },
    jpg: { "image/jpeg": [".jpg", ".jpeg"] },
  }

  const dropzoneAccept = useMemo(() => {
    return allowedTypes.reduce((acc, type) => {
      const mimeMatch = MIME_MAP[type.toLowerCase()];
      return mimeMatch ? { ...acc, ...mimeMatch } : acc;
    }, {});
  }, [allowedTypes]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: dropzoneAccept,

    // maxSize is in bytes, so we need to convert from MB to bytes
    maxSize: maxFileSize * 1024 * 1024,

    // if multipleFiles is false, we still want to allow only one file to be selected in the file dialog,
    // but we will handle the case where users try to drop multiple files in onDrop by only taking the first file.
    multiple: multipleFiles,

    // this will prevent users from selecting more than the allowed number of files in the file dialog (eg. maxFilesAllowed=1 will only allow selecting one file).
    //  But it won't prevent users from dragging and dropping more than the allowed number of files, so we also need to handle that in onDrop.
    maxFiles: maxFilesAllowed,
    onDrop: (acceptedFiles) => {
      onFilesChange(acceptedFiles);
    },

  });



  return (
    <div className={`flex flex-col gap-2 w-full`}>
      {label && (
        <div className="relative">
          <label className="text-h5">
            {label}
            {optional && <span className="text-caption text-muted"> (optional)</span>}
          </label>
          {inputWarning && <InputWarnMessage message={inputWarning} />}
        </div>
      )}

      {files.length === 0 && (
        <div
          {...getRootProps()}
          className={`relative noise-overlay flex ${heightClass} w-full  flex-col  items-center border border-dashed bg-primary-16 justify-center `}
        >
          <input {...getInputProps()} className="hidden" />

          <Icon
            name="mdi:cloud-upload-outline"
            height="113px"
            width="155px"
            className="text-primary/70"
          />

          <p className="text-h4">
            Drag and Drop your files here
          </p>
          <p className="text-body">or Click to browse computer</p>
          Supported Formats: {
            Object.keys(dropzoneAccept)
              .map(type => type.split('/')[1].toUpperCase()) // Turns 'video/mp4' into 'MP4'
              .join(", ")
          }. Max Size: {maxFileSize}MB.
        </div>
      )}

      {files.length > 0 && (
        <div className="w-full space-y-3">
          {UploadedFiles}
        </div>
      )}
      {fileRejections.length > 0 && (
        <div className="text-red-500 mt-2">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              {errors.map((e) => (
                <p key={e.code}>
                  {e.code === "file-too-large" && "File exceeds 5MB"}
                  {e.code === "file-invalid-type" && "Invalid file type"}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
