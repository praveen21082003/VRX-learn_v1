import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { BackButton, Button, Input, Select, UploadSection } from "@/components/ui";

import ReportsForm from '@/components/forms/ReportsForm';

function ReportProblem() {


    const navigate = useNavigate();

    useDocumentTitle("Report a Problem");

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/dashboard');
        }
    }


    return (
        <div className='space-y-4 px-6 py-8'>
            <BackButton label='Back' onClick={handleBack} />

            <div className='space-y-2'>
                <h3 className='text-h3'>Report a problem</h3>
                <p className='text-body text-muted'>Please provide details about the issue you encountered. Your feedback helps us improve the learning experience.</p>
            </div>
            <ReportsForm />

        </div>
    )
}

export default ReportProblem
