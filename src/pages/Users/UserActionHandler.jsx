import React, { useState } from 'react'
import UserForm from '@/components/forms/UserForm'

function UserActionHandler({ mode, userData, onClose, onSuccess }) {
    return (
        <UserForm
            initialData={userData}
            onClose={onClose}
            mode={mode}
            onSuccess={onSuccess}
        />
    )
}

export default UserActionHandler
