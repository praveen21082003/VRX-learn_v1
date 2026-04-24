import { createContext, useCallback, useContext, useState } from "react";
import clsx from 'clsx';
import { Icon, Button } from '@/components/ui'

const ToastContext = createContext();

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        console.warn("useToast used outside ToastProvider");
        return { addToast: () => { } };
    }

    return context;
}


export function ToastProvider({ children }) {

    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();

        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id != id))
        }, 5000)  // 3 seconds
    }, []);

    const handleClose = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id != id))
    }


    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed w-80 top-18 right-6 space-y-3 z-50">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={clsx(
                            "px-5 py-2 border-l-5 rounded shadow-lg font-medium animate-slideIn",

                            toast.type === "success" && "bg-[#D1E7DD] text-text-muted border-[#0F2D1F]",
                            toast.type === "error" && "bg-[#F8D7DA] text-text-muted border-[#661414]",
                            toast.type === "warning" && "bg-[#e7f8d7] text-[#D32F2F] border-[#ffcc00]",
                            toast.type === "info" && "bg-[#D0E8FF] text-[#0A2540] border-[#1565C0]",
                        )}
                    >
                        <div className="flex justify-between items-center">
                            <div className="items-center flex gap-2.5">
                                {toast.type === "success"
                                    ? <Icon name="mdi:checkbox-marked-circle" height="25" width="25" />
                                    : <Icon name="bxs:error" height="25" width="25" />
                                }

                                <span>
                                    <h5 className="text-sm font-semibold">{toast.type}</h5>
                                    <p className="text-xs text-dark-gray">{toast.message}</p>
                                </span>
                            </div>

                            {/* <Icon name="maki:cross" height="24" width="24" /> */}
                            <Button frontIconName="maki:cross" frontIconHeight="20" frontIconWidth="20" bgClass="bg-none" onClick={() => handleClose(toast.id)} textClass="text-dark-gray" />
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )

}