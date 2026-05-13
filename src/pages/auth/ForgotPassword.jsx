import React from 'react'

import { Icon, Input, Button } from "@/components/ui";

function ForgotPassword() {

    
    return (
        <div>
            <p className="text-sm  text-center mb-4 mt-2 ">
                No Worries , Enter your Email Address and we'll send you a link to reset
                your password.
            </p>
            <form className="space-y-8">
                <Input
                    name="email"
                    label="Email"
                    placeholder="Enter your email id"
                    paddingClass="p-2"
                    icon="ic:outline-email"
                    // inputWarning={warning.email}
                    // onChange={handleChange}
                    bgClass="bg-surface"
                    // value={credentials.email}
                    autoComplete="email"
                />

                <div className='space-y-4 flex flex-col'>
                    <Button
                        type="submit"
                        className="p-2 rounded-lg font-semibold  mt-4 cursor-pointer"
                        buttonName="Send Reset Link"
                    />
                    <Button
                        // onClick={}
                        bgClass=""
                        textClass=""
                        className="rounded-lg p-2 font-semibold "
                        buttonName="Back To Login"
                        frontIconName="eva:arrow-back-fill"
                    />

                </div>
            </form>
        </div>
    )
}

export default ForgotPassword
