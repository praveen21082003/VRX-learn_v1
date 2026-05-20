import React from 'react'
import Icon from '../Icon'

function InputWarnMessage(
    {
        message,
        icon = "jam:triangle-danger-f"
    }
) {


    return (
        <div className='flex gap-1.5 font-medium items-center text-[#D32F2F]'>
            <span className='items-center'>
                <Icon name={icon} width="14px" height="14px" />
            </span>
            <p className='text-xs'>{message}</p>
        </div>
    )
}

export default InputWarnMessage
