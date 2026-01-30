import { useState, useEffect } from "react";
import type { AlertType, AlertRequestDTO } from "../types/api";
import { AlertRequestSchema } from "../types/api";

interface AlertFormProps {
    editingAlert: AlertType | null;
    onSubmit: (data: AlertRequestDTO) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

interface FormErrors {
    country?: string;
    city?: string;
    visaType?: string;
    status?: string;
}

export function AlertForm({
    editingAlert,
    onSubmit,
    onCancel,
    isSubmitting,
}: AlertFormProps) {
    const [formData, setFormData] = useState<AlertRequestDTO>({
        country: "",
        city: "",
        visaType: "Tourist",
        status: "Active",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (editingAlert) {
            setFormData({
                country: editingAlert.country,
                city: editingAlert.city,
                visaType: editingAlert.visaType,
                status: editingAlert.status,
            });
        } else {
            setFormData({
                country: "",
                city: "",
                visaType: "Tourist",
                status: "Active",
            });
        }
        setErrors({});
    }, [editingAlert]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate with Zod
        const result = AlertRequestSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof FormErrors;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        await onSubmit(result.data);
    };

    const isEditing = editingAlert !== null;

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label" htmlFor="country">
                        Country <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>
                    <input
                        id="country"
                        name="country"
                        type="text"
                        className={`form-input ${errors.country ? "error" : ""}`}
                        placeholder="e.g., United States"
                        value={formData.country}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                    {errors.country && (
                        <span className="form-error">
                            <span>⚠</span> {errors.country}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="city">
                        City <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        className={`form-input ${errors.city ? "error" : ""}`}
                        placeholder="e.g., New York"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                    {errors.city && (
                        <span className="form-error">
                            <span>⚠</span> {errors.city}
                        </span>
                    )}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label" htmlFor="visaType">
                        Visa Type <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>
                    <select
                        id="visaType"
                        name="visaType"
                        className={`form-select ${errors.visaType ? "error" : ""}`}
                        value={formData.visaType}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    >
                        <option value="Tourist">Tourist</option>
                        <option value="Business">Business</option>
                        <option value="Student">Student</option>
                    </select>
                    {errors.visaType && (
                        <span className="form-error">
                            <span>⚠</span> {errors.visaType}
                        </span>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="status">
                        Status <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>
                    <select
                        id="status"
                        name="status"
                        className={`form-select ${errors.status ? "error" : ""}`}
                        value={formData.status}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    >
                        <option value="Active">Active</option>
                        <option value="Booked">Booked</option>
                        <option value="Expired">Expired</option>
                    </select>
                    {errors.status && (
                        <span className="form-error">
                            <span>⚠</span> {errors.status}
                        </span>
                    )}
                </div>
            </div>

            <div className="form-actions">
                {isEditing && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                )}
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting
                        ? "Saving..."
                        : isEditing
                            ? "Update Alert"
                            : "Create Alert"}
                </button>
            </div>
        </form>
    );
}
