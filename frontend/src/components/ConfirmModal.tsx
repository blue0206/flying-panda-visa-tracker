import type { ReactNode } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    variant?: "danger" | "primary";
}

export function ConfirmModal({
    isOpen,
    title,
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isLoading = false,
    variant = "primary",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="modal-header">
                    <h2 className="modal-title" id="modal-title">
                        {title}
                    </h2>
                </div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
                        {cancelText}
                    </button>
                    <button
                        className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
