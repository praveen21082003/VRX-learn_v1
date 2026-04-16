import { Button } from "@/components/ui";

export default function Modal({ isOpen, onClose, title, children, width = "max-w-lg" }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">

            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />


            <div className={`relative bg-background text-main rounded-lg shadow-lg w-full ${width} max-h-[90vh] flex flex-col`}>


                <div className="flex justify-between items-center p-4">
                    <h3 className="text-h3">{title}</h3>
                    <Button
                        frontIconName="maki:cross"
                        frontIconHeight="24"
                        frontIconWidth="24"
                        bgClass=""
                        textClass=""
                        onClick={onClose}
                    />
                </div>


                <div className="p-4 overflow-y-auto">
                    {children}
                </div>

            </div>
        </div>
    );
}