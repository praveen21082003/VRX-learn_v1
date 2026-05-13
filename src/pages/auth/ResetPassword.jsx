import React from 'react'
import { Icon, Input, Button } from "@/components/ui";

import { useSearchParams } from 'react-router-dom';

function ResetPassword() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    console.log(token);

    return (
        <>
            <form className='space-y-3 w-full'>
                <Input
                    name="password"
                    type="password"
                    label="New Password"
                    placeholder="Enter your new password"
                    paddingClass="p-2"
                    icon="material-symbols:lock"
                    // inputWarning={warning.password}
                    // onChange={handleChange}
                    // value={passwords.password}
                    autoComplete="new-password"
                />

                <Input
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    paddingClass="p-2"
                    icon="material-symbols:lock"
                    // inputWarning={warning.password}
                    // onChange={handleChange}
                    // value={passwords.confirmPassword}
                    autoComplete="new-password"
                />
                <div className='space-y-4 flex flex-col'>
                    <Button
                        type="submit"
                        className="p-2 rounded-lg font-semibold  mt-4 cursor-pointer"
                        buttonName="Reset Password"
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
        </>
    )
}

export default ResetPassword
