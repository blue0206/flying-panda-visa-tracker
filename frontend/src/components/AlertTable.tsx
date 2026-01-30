import type { AlertType } from "../types/api";

interface AlertTableProps {
    alerts: AlertType[];
    isLoading: boolean;
    onEdit: (alert: AlertType) => void;
    onDelete: (alert: AlertType) => void;
}

export function AlertTable({
    alerts,
    isLoading,
    onEdit,
    onDelete,
}: AlertTableProps) {
    const getStatusClass = (status: string) => {
        switch (status) {
            case "Active":
                return "badge-active";
            case "Booked":
                return "badge-booked";
            case "Expired":
                return "badge-expired";
            default:
                return "";
        }
    };

    const getVisaTypeClass = (visaType: string) => {
        switch (visaType) {
            case "Tourist":
                return "badge-tourist";
            case "Business":
                return "badge-business";
            case "Student":
                return "badge-student";
            default:
                return "";
        }
    };

    if (isLoading) {
        return (
            <div className="table-container">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton-row">
                        <div className="skeleton skeleton-cell" />
                        <div className="skeleton skeleton-cell" />
                        <div className="skeleton skeleton-badge" />
                        <div className="skeleton skeleton-badge" />
                        <div className="skeleton skeleton-button" />
                    </div>
                ))}
            </div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3 className="empty-state-title">No alerts found</h3>
                <p className="empty-state-message">
                    Create your first visa alert using the form above, or try adjusting your filters.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="table-container desktop-only">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>City</th>
                            <th>Visa Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr key={alert.id}>
                                <td>{alert.country}</td>
                                <td>{alert.city}</td>
                                <td>
                                    <span className={`badge ${getVisaTypeClass(alert.visaType)}`}>
                                        {alert.visaType}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${getStatusClass(alert.status)}`}>
                                        <span style={{ marginRight: "4px" }}>
                                            {alert.status === "Active" && "●"}
                                            {alert.status === "Booked" && "✓"}
                                            {alert.status === "Expired" && "○"}
                                        </span>
                                        {alert.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => onEdit(alert)}
                                            aria-label={`Edit alert for ${alert.city}, ${alert.country}`}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => onDelete(alert)}
                                            aria-label={`Delete alert for ${alert.city}, ${alert.country}`}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-only">
                {alerts.map((alert) => (
                    <div key={alert.id} className="table-card">
                        <div className="table-card-header">
                            <div className="table-card-title">
                                {alert.city}, {alert.country}
                            </div>
                            <div className="table-card-badges">
                                <span className={`badge ${getVisaTypeClass(alert.visaType)}`}>
                                    {alert.visaType}
                                </span>
                                <span className={`badge ${getStatusClass(alert.status)}`}>
                                    {alert.status}
                                </span>
                            </div>
                        </div>
                        <div className="table-card-actions">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => onEdit(alert)}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => onDelete(alert)}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
