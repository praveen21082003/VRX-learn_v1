import React from 'react'
import Icon from '../Icon'

function InputWarnMessage(
    {
        message,
        icon = "jam:triangle-danger-f"
    }
) {


    return (
        <div className='flex gap-1.5 font-medium text-[#D32F2F]'>
            <Icon name={icon} width="16px" height="16px" />
            <p className='text-xs'>{message}</p>
        </div>
    )
}

export default InputWarnMessage
