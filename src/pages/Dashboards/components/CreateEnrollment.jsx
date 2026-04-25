import React from 'react'
import EnrollmentForm from '../../../components/forms/EnrollmentForm'

function CreateEnrollment({EnrollmentData, onClose, onSuccess, mode = "create"}) {
  return (
    <EnrollmentForm
      initialData={EnrollmentData}
      onClose={onClose}
      onSuccess={onSuccess}
      mode={mode}
    />
  )
}

export default CreateEnrollment
