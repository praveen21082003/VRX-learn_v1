import React, { useState } from 'react'
import UserForm from '../../../components/forms/UserForm'



function CreateUser({ userData = {}, mode = "create", onSuccess, onClose }) {



    return (
        <>
            <UserForm
                initialData={userData}
                onClose={onClose}
                onSuccess={onSuccess}
                mode={mode}
            />
        </>
    )
}

export default CreateUser
