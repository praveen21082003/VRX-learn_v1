import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Input, TextEditor, Button, UploadSection } from '@/components/ui'
import useLessonActions from './hooks/useLessonActions';
import { useToast } from '@/context/ToastProvider';

function LessonForm({ mode, initialData, modules, courseId }) {
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { moduleId } = useParams();

  const currentModule = modules?.find(m => String(m.id) === String(moduleId));

  const {
    createLessonAction,
    updateLessonAction,
    isCreating,
    isUpdating,
    uploadProgress,
    loadedData,
    mediaStatus,
  } = useLessonActions();

  // form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [warning, setWarning] = useState({});

  // populate form in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (field, value) => {
    const processedValue = field === "title" ? value.toUpperCase() : value;

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    setWarning(prev => ({ ...prev, [field]: null }));
  };

  // validation
  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";

    // description is optional
    // if (!formData.description.trim()) errors.description = "Description is required";
    if (!isEdit && files.length === 0) errors.file = "Please upload a file";
    return errors;
  };

  // build update payload — only changed fields, no nulls
  const buildUpdatePayload = () => {
    const payload = {};
    if (formData.title.trim() !== (initialData?.title || "").trim()) {
      payload.title = formData.title.trim();
    }
    if (formData.description.trim() !== (initialData?.description || "").trim()) {
      payload.description = formData.description.trim();
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setWarning(errors);
      return;
    }

    if (isEdit) {
      const payload = buildUpdatePayload();

      if (Object.keys(payload).length === 0) {
        addToast("No changes made", "info");
        return;
      }

      const result = await updateLessonAction(initialData.id, payload);
      if (!result.success) {
        addToast(result.message, "error");
        return;
      }

      addToast(result.message, "success");
      navigate(`/course/${courseId}/content/modules/${moduleId}`);

    } else {
      const file = files[0];

      // build create payload
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        moduleId: moduleId,
        filename: file?.name || "",
        contentType: file?.type || "",
        fileSize: file?.size || 1,
      };

      const result = await createLessonAction(payload, file);
      if (!result.success) {
        addToast(result.message, "error");
        return;
      }

      addToast(result.message, "success");
      navigate(`/course/${courseId}/content/modules/${moduleId}`);
    }
  };

  const isLoading = isCreating || isUpdating;

  const getButtonText = () => {
    if (!isEdit) {
      if (isCreating && uploadProgress === 0) return "Preparing...";
      if (isCreating && uploadProgress > 0 && uploadProgress < 100) return `Uploading... ${uploadProgress}%`;
      if (mediaStatus === "uploaded") return "Finalizing...";
      return files.length > 0 ? "Upload & Create" : "Create Lesson";
    }
    if (isUpdating) return "Updating...";
    return "Save Changes";
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Title"
        placeholder="Lesson name"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        inputWarning={warning.title}
      />

      <div className="space-y-2">
        <TextEditor
          label="Overview"
          value={formData.description}
          onChange={(value) => handleChange("description", value)}
          inputWarning={warning.description}
        />
      </div>

      {/* file upload only in create mode */}
      {!isEdit ? (
        <UploadSection
          label="Lesson attachment"
          files={files}
          setFiles={(newFiles) => {
            setFiles(newFiles);
            setWarning(prev => ({ ...prev, file: null }));
          }}
          uploadProgress={uploadProgress}
          isUploading={isCreating}
          isUploaded={uploadProgress === 100}
          mediaStatus={mediaStatus}
          loadedData={loadedData}
          inputWarning={warning.file}
          allowedTypes={['pdf', 'mp4']}
          maxFileSize={30}
        />
      ) : (
        <div className="text-sm text-muted-foreground">
          Lesson content (pdf or document)
        </div>
      )}

      <div className='flex justify-center'>
        <Button
          type="submit"
          disabled={isLoading}
          buttonName={getButtonText()}
          className="mt-5 px-5 py-2 rounded"
        />
      </div>
    </form>
  );
}

export default LessonForm;