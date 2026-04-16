import { Button } from '@/components/ui'

export default function UploadButton({ files, onUpload }) {
    if (files.length === 0) return null;

    return (
        <div className="flex justify-center">
            <Button
                buttonName="Upload"
                className="mt-5 px-5 py-2 rounded"
                onClick={onUpload}
            />
        </div>
    );
}