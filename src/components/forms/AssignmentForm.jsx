import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, TextEditor, UploadSection, Button, AttachmentCard, BackButton } from '@/components/ui'

import formatDateTimeLocal from '@/utils/formatDateTimeLocal'
import useAssignmentActions from './hooks/useAssignmentActions'

import { useToast } from '@/context/ToastProvider'

function AssignmentForm({ courseId, mode, initialData, assignments, setAssignments  }) {
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    createAssignment,
    updateAssignment,
    creating,
    updating,
    uploadProgress,
    uploadedBytes,
    mediaStatus,
  } = useAssignmentActions();

  const [files, setFiles] = useState([]);
  const [warning, setWarning] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    instructions: "",
    dueDate: null,
    maxScore: 5,
    numberOfAttempts: 1,
  });

  // populate in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        title: initialData.title || "",
        instructions: initialData.instructions || "",
        dueDate: initialData.dueDate || null,
        maxScore: initialData.maxScore ?? 5,
        numberOfAttempts: initialData.numberOfAttempts ?? 1,
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setWarning(prev => ({ ...prev, [field]: null }));
  };

  // validation
  const validate = () => {
    const errors = {};
    const file = files?.[0];
    const instructions = formData.instructions?.trim();

    // title required
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    // instructions OR file required — both allowed, neither is not
    if (!isEdit && !instructions && !file) {
      errors.instructions = "Enter instructions or upload a file";
      errors.file = "Upload a file or enter instructions";
    }

    // maxScore only on create
    if (!isEdit) {
      if (!formData.maxScore || formData.maxScore < 5 || formData.maxScore > 100) {
        errors.maxScore = "Max score must be between 5 and 100";
      }
      if (formData.numberOfAttempts < 1 || formData.numberOfAttempts > 3) {
        errors.numberOfAttempts = "Attempts must be between 1 and 3";
      }
    }

    return errors;
  };

  // build update payload — only changed fields, no nulls
  const buildUpdatePayload = () => {
    const payload = {};
    if (formData.title.trim() !== (initialData?.title || "").trim()) {
      payload.title = formData.title.trim();
    }
    if (formData.instructions?.trim() !== (initialData?.instructions || "").trim()) {
      payload.instructions = formData.instructions?.trim();
    }
    if (formData.dueDate !== initialData?.dueDate) {
      payload.dueDate = formData.dueDate;
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

    const file = files?.[0] || null;

    if (isEdit) {
      const payload = buildUpdatePayload();

      if (Object.keys(payload).length === 0) {
        addToast("No changes made", "info");
        return;
      }

      const result = await updateAssignment(initialData.id, payload);
      if (!result.success) {
        addToast(result.message, "error");
        return;
      }

      // update context
      const updated = assignments.map(a =>
        a.id === initialData.id ? { ...a, ...payload } : a
      );
      setAssignments(updated);

      addToast(result.message, "success");
      navigate(`/course/${courseId}/content/assignments`);

    } else {
      const assignmentData = {
        title: formData.title.trim(),
        instructions: formData.instructions?.trim() || "",
        courseId: courseId,
        dueDate: formData.dueDate,
        maxScore: formData.maxScore,
        numberOfAttempts: formData.numberOfAttempts,
      };

      const result = await createAssignment(assignmentData, file);

      if (!result.success && !result.partialSuccess) {
        addToast(result.message, "error");
        return;
      }

      if (result.partialSuccess) {
        addToast(result.message, "warning");
      } else {
        addToast(result.message, "success");
      }

      // update context
      setAssignments([result.data, ...assignments]);
      navigate(`/course/${courseId}/content/assignments`);
    }
  };

  const isLoading = creating || updating;

  const getButtonText = () => {
    if (!isEdit) {
      if (creating && uploadProgress === 0) return "Preparing...";
      if (creating && uploadProgress > 0 && uploadProgress < 100) return `Uploading... ${uploadProgress}%`;
      if (mediaStatus === "uploaded") return "Finalizing...";
      return files.length > 0 ? "Upload & Submit" : "Submit"; // ← files not file
    }
    if (updating) return "Updating...";
    return "Save Changes";
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>

      <Input
        label="Title"
        value={formData.title}
        inputWarning={warning.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />

      <TextEditor
        label="Instructions"
        value={formData.instructions}
        onChange={(value) => handleChange("instructions", value)}
        inputWarning={warning.instructions}
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
        <Input
          label="Due Date & Time"
          type="datetime-local"
          min={new Date().toISOString().slice(0, 16)}
          value={formatDateTimeLocal(formData.dueDate)}
          onChange={(e) => handleChange("dueDate", e.target.value)}
        />
        <Input
          label="Max Points"
          type="number"
          min="5"
          max="100"
          disabled={isEdit}
          value={formData.maxScore}
          inputWarning={warning.maxScore}
          onChange={(e) => handleChange("maxScore", Number(e.target.value))}
        />
        <Input
          label="Max Attempts"
          type="number"
          min="1"
          max="3"
          disabled={isEdit}
          value={formData.numberOfAttempts}
          inputWarning={warning.numberOfAttempts}
          onChange={(e) => handleChange("numberOfAttempts", Number(e.target.value))}
        />
      </div>

      {isEdit && (
        <p className="text-caption text-muted">
          Max score and attempts cannot be changed once created
        </p>
      )}

      {/* file upload only on create */}
      {!isEdit && (
        <UploadSection
          files={files}
          setFiles={(newFiles) => {
            setFiles(newFiles);
            setWarning(prev => ({ ...prev, file: null }));
          }}
          label="Attachments"
          optional={true}
          inputWarning={warning.file}
        />
      )}

      {/* show existing attachment on edit */}
      {isEdit && initialData?.attachment && (
        <div>
          <h3 className="text-h45 mt-6">Attachments</h3>
          <p className="text-caption text-muted mt-1">
            Existing attachments are read-only and cannot be modified.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <AttachmentCard
              fileName={initialData.attachment.filename}
              url={initialData.attachment.url}
            />
          </div>
        </div>
      )}

      <div className="flex justify-center">
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

export default AssignmentForm;