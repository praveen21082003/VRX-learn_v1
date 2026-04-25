import React from 'react'
import EnrollmentForm from '@/components/forms/EnrollmentForm'


function EnrollmentActionHandler({
  mode,
  EnrollmentData,
  onClose,
  onSuccess
}) {



  const isEdit = mode === "edit";


  return (
    <EnrollmentForm
      initialData={EnrollmentData}
      isEdit={isEdit}
      onClose={onClose}
      onSuccess={onSuccess}
      mode={mode}
    />
  )
}

export default EnrollmentActionHandler
