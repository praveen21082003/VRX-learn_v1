import { useAuth } from '@/context/AuthContext';
import { Modal, Button } from '@/components/ui';

function LogOut({ isOpen, onClose }) {
    const { handleLogout, loading } = useAuth();


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