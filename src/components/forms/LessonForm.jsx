import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import { useScrollToError } from '@/hooks/useScrollToError';
import useLessonActions from './hooks/useLessonActions';

import { useToast } from '@/context/ToastProvider';

import { Input, TextEditor, Button, UploadSection } from '@/components/ui'

function LessonForm({ mode, initialData, modules, courseId, invalidateCache }) {


  const titleRef = useRef(null);
  const fileRef = useRef(null);

  const refs = {
    title: titleRef,
    file: fileRef,
  };


  const scrollToError = useScrollToError(refs);


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
    if (field === "title") {
      value = value.replace(/\s+/g, " ")
        .replace(/^\s/, "");
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    setWarning(prev => ({ ...prev, [field]: null }));
  };

  // validation
  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";

    // description is optional
    const longDesc = formData.description?.trim();
    if (longDesc && longDesc.length > 5000) {
      errors.description = `Description must be under 5000 characters (${longDesc.length}/5000)`;
    }
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

    // 1. Frontend validation
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setWarning(errors);
      scrollToError(errors);
      return;
    }

    // 2. EDIT MODE
    if (isEdit) {
      const payload = buildUpdatePayload();

      if (Object.keys(payload).length === 0) {
        addToast("No changes made", "info");
        return;
      }

      const result = await updateLessonAction(initialData.id, payload);

      // handle inline field error (title duplicate)
      const newWarning = {};

      if (result.status === 409) {
        newWarning.title = "A lesson with this title already exists in this module.";
      }

      if (Object.keys(newWarning).length > 0) {
        setWarning(newWarning);
        scrollToError(newWarning);
        return;
      }

      // generic error
      if (!result.success) {
        addToast(result.message, "error");
        return;
      }

      // success
      addToast(result.message, "success");
      invalidateCache?.(moduleId);
      navigate(`/course/${courseId}/content/modules/${moduleId}`);
    }

    // 3. CREATE MODE
    else {
      const file = files[0];

      // const payload = {
      //   title: formData.title.trim(),
      //   description: formData.description.trim(),
      //   moduleId: moduleId,
      //   filename: file?.name || "",
      //   contentType: file?.type || "",
      //   fileSize: file?.size || 1,
      // };

      const payload = {
        "lesson": {
          "title": formData.title.trim(),
          "description": formData.description.trim(),
          "moduleId": moduleId
        },
        "attachment": {
          "filename": file?.name || "",
          "contentType": file?.type || "",
          "size": file?.size || 0,
        }
      }

      const result = await createLessonAction(payload, file);

      // handle inline field error (title duplicate)
      const newWarning = {};

      if (result.status === 409) {
        newWarning.title = "A lesson with this title already exists in this module.";
      }

      if (Object.keys(newWarning).length > 0) {
        setWarning(newWarning);
        scrollToError(newWarning);
        return;
      }

      // generic error
      if (!result.success) {
        addToast(result.message, "error");
        return;
      }

      // success
      addToast(result.message, "success");
      invalidateCache?.(moduleId);
      navigate(`/course/${courseId}/content/modules/${moduleId}`);
    }
  };

  const isLoading = isCreating || isUpdating;

  const getButtonText = () => {
    if (!isEdit) {
      if (isCreating && uploadProgress === 0) return "Preparing...";
      if (isCreating && uploadProgress > 0 && uploadProgress < 100) return `Uploading...`;
      if (mediaStatus === "uploaded") return "Finalizing...";
      return files.length > 0 ? "Upload & Create" : "Create Lesson";
    }
    if (isUpdating) return "Updating...";
    return "Save Changes";
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div ref={titleRef}>
        <Input
          label="Title"
          placeholder="Lesson name"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          inputWarning={warning.title}
          uppercase
        />
      </div>

      <div className="space-y-2">
        <TextEditor
          label="Overview"
          placeholder="Provide a brief overview of the lesson content"
          value={formData.description}
          onChange={(value) => handleChange("description", value)}
          inputWarning={warning.description}
          showCount
          maxLength={5000}
        />
      </div>

      {/* file upload only in create mode */}
      {!isEdit ? (

        <div ref={fileRef}>
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
            maxFileSize={2000}
          />
        </div>
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