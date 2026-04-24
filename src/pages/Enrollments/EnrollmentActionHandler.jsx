import React from 'react'
import EnrollmentForm from '@/components/forms/EnrollmentForm'
import { useEnrollmentActions } from '../../../src/components/forms/hooks/useEnrollmentActions' 

function EnrollmentActionHandler({
  mode,
  EnrollmentData,
  onClose,
  onSuccess
}) {

const {
        createNewEnrollment,
        updateEnrollment,
        deleteEnrollment,
        creating,
        updating,
        deleting,
    } = useEnrollmentActions();

  const isEdit = mode === "edit";


  return (
    <EnrollmentForm
      initialData={EnrollmentData}
      isEdit={isEdit} // Pass this down!
      onClose={onClose}
      onSuccess={onSuccess}
      mode={mode}                          
            creating={creating}                  
            updating={updating}                  
            deleting={deleting}                  
            createNewEnrollment={createNewEnrollment}  
            updateEnrollment={updateEnrollment}        
            deleteEnrollment={deleteEnrollment}
    />
  )
}

export default EnrollmentActionHandler
