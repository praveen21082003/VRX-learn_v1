import React, { useState } from 'react'
import UserForm from '../../../components/forms/UserForm'


function CreateUser(userData = {}, statuses = [], onClose, onSuccess) {


    const handleAction = () => {

    }



    return (
        <>
            <UserForm
                initialData={userData}
                onSubmit={handleAction}
                onClose={onClose}
                mode="create"
            />
        </>
    )
}

export default CreateUser
