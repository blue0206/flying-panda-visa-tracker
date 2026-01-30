import { useState, useCallback, useMemo, useEffect } from "react";
import "./App.css";
import {
  useGetAlertsQuery,
  useCreateAlertMutation,
  useUpdateAlertMutation,
  useDeleteAlertMutation,
} from "./app/api";
import {
  AlertForm,
  AlertTable,
  AlertFilters,
  Pagination,
  ConfirmModal,
  ThemeToggle,
  useToast,
} from "./components";
import type { AlertType, AlertRequestDTO } from "./types/api";

function App() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Filter state
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    visaType: "",
    status: "",
  });

  // For debouncing text filters
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce text filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setCurrentPage(1); // Reset to first page on filter change
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  // Build query string
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", limit.toString());

    if (debouncedFilters.country) params.set("country", debouncedFilters.country);
    if (debouncedFilters.city) params.set("city", debouncedFilters.city);
    if (debouncedFilters.visaType) params.set("visaType", debouncedFilters.visaType);
    if (debouncedFilters.status) params.set("status", debouncedFilters.status);

    return `?${params.toString()}`;
  }, [currentPage, debouncedFilters]);

  // RTK Query hooks
  const { data, isLoading, isError, error } = useGetAlertsQuery(queryString);
  const [createAlert, { isLoading: isCreating }] = useCreateAlertMutation();
  const [updateAlert, { isLoading: isUpdating }] = useUpdateAlertMutation();
  const [deleteAlert, { isLoading: isDeleting }] = useDeleteAlertMutation();

  // Toast notifications
  const { addToast } = useToast();

  // Edit mode state
  const [editingAlert, setEditingAlert] = useState<AlertType | null>(null);

  // Delete modal state
  const [alertToDelete, setAlertToDelete] = useState<AlertType | null>(null);

  // Handlers
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ country: "", city: "", visaType: "", status: "" });
  }, []);

  const handleFormSubmit = async (formData: AlertRequestDTO) => {
    try {
      if (editingAlert) {
        await updateAlert({ id: editingAlert.id, body: formData }).unwrap();
        addToast("success", "Alert Updated", `Successfully updated alert for ${formData.city}, ${formData.country}`);
        setEditingAlert(null);
      } else {
        await createAlert(formData).unwrap();
        addToast("success", "Alert Created", `Successfully created alert for ${formData.city}, ${formData.country}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      addToast("error", editingAlert ? "Update Failed" : "Create Failed", message);
    }
  };

  const handleCancelEdit = useCallback(() => {
    setEditingAlert(null);
  }, []);

  const handleEdit = useCallback((alert: AlertType) => {
    setEditingAlert(alert);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDeleteClick = useCallback((alert: AlertType) => {
    setAlertToDelete(alert);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!alertToDelete) return;

    try {
      await deleteAlert(alertToDelete.id).unwrap();
      addToast("success", "Alert Deleted", `Successfully deleted alert for ${alertToDelete.city}, ${alertToDelete.country}`);
      setAlertToDelete(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      addToast("error", "Delete Failed", message);
    }
  };

  const handleDeleteCancel = useCallback(() => {
    setAlertToDelete(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to table
    window.scrollTo({ top: 200, behavior: "smooth" });
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            <span className="header-title-icon">✈️</span>
            Visa Alert Tracker
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Alert Form Card */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">
              {editingAlert ? "Edit Alert" : "Create New Alert"}
            </h2>
          </div>
          <div className="card-body">
            <AlertForm
              editingAlert={editingAlert}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelEdit}
              isSubmitting={isCreating || isUpdating}
            />
          </div>
        </section>

        {/* Alerts Table Card */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Your Alerts</h2>
            <AlertFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Error State */}
          {isError && (
            <div className="card-body">
              <div className="error-state">
                <div className="error-state-icon">⚠️</div>
                <p className="error-state-message">
                  {error instanceof Error ? error.message : "Failed to load alerts. Please try again."}
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          {!isError && (
            <>
              <AlertTable
                alerts={data?.data || []}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />

              {/* Pagination */}
              {data && data.pagination.totalPages > 0 && (
                <Pagination
                  currentPage={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  totalItems={data.pagination.total}
                  limit={data.pagination.limit}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={alertToDelete !== null}
        title="Delete Alert"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
        variant="danger"
      >
        <p>
          Are you sure you want to delete the alert for{" "}
          <strong>
            {alertToDelete?.city}, {alertToDelete?.country}
          </strong>
          ?
        </p>
        <p style={{ marginTop: "var(--spacing-2)", fontSize: "var(--font-size-sm)" }}>
          This action cannot be undone.
        </p>
      </ConfirmModal>
    </div>
  );
}

export default App;
