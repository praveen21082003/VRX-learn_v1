import { useState, useEffect } from "react";
import { Input, Button, Icon } from "@/components/ui";

export default function DeleteConfirmContent({
    onClose,
    onConfirm,
    confirmText,
    entityName = "item",
    message,
    loading = false,
}) {
    const [input, setInput] = useState("");

    console.log(confirmText)

    useEffect(() => {
        setInput("");
    }, []);

    const safeConfirmText = confirmText || "";

    const isMatch =
        input.trim().toLowerCase() === safeConfirmText.toLowerCase();;

    return (
        <div className="space-y-4">

            <div className="border border-red-300 bg-red-50 text-red-600 p-2 rounded text-large">
                <Icon name="jam:triangle-danger-f" height="26" width="26" /> This action cannot be undone.
            </div>

            <p className="text-body text-muted">
                {message}
            </p>

            <p className="text-body">
                Please type <b>{confirmText}</b> to confirm.
            </p>


            <Input
                placeholder="Type to confirm..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />


            <div className="flex gap-3">

                <Button
                    disabled={!isMatch || loading}
                    buttonName={loading ? "Deleting..." : `I understand, delete this ${entityName}`}
                    onClick={onConfirm}
                    className="w-full bg-primary py-2 rounded-lg text-white"
                />
            </div>
        </div>
    );
}