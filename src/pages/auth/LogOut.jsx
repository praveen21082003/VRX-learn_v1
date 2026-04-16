import React, { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { Modal, Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '@/services/User.service';

function LogOut({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { logout } = useAuth();

    async function handleLogout() {
        setLoading(true);
        try {
            await userLogout();
            // 
            // // clear other things if needed
            // // localStorage.clear();

            logout();
            navigate("/", { replace: true });
        } catch (err) {
            console.log("Logout error:", err);
            logout();
            navigate("/", { replace: true });
        } finally {
            setLoading(false);
            onClose?.();
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Are you sure you want to log out?"
        >
            <div className="flex flex-col gap-4">

                <p className="text-sm text-muted">
                    You will be signed out of your account.
                </p>

                <div className="flex gap-3 mt-2">

                    <Button
                        buttonName="Cancel"
                        bgClass="bg-main border border-default"
                        textClass="text-main"
                        className="w-full py-2 rounded-lg"
                        onClick={onClose}
                    />

                    <Button
                        buttonName={loading ? "Logging out..." : "Log out"}
                        bgClass="bg-primary"
                        textClass="text-white"
                        className="w-full py-2 rounded-lg"
                        onClick={handleLogout}
                        disabled={loading}
                    />

                </div>
            </div>
        </Modal>
    );
}

export default LogOut;