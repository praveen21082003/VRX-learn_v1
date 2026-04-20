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
      isEdit={isEdit} // Pass this down!
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}

export default EnrollmentActionHandler
