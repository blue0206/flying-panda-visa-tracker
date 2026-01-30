interface AlertFiltersProps {
    filters: {
        country: string;
        city: string;
        visaType: string;
        status: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onClearFilters: () => void;
}

export function AlertFilters({
    filters,
    onFilterChange,
    onClearFilters,
}: AlertFiltersProps) {
    const hasActiveFilters = Object.values(filters).some((v) => v !== "");

    return (
        <div className="filters">
            <div className="filter-group">
                <label className="filter-label" htmlFor="filter-country">
                    Country
                </label>
                <input
                    id="filter-country"
                    type="text"
                    className="filter-input"
                    placeholder="Search..."
                    value={filters.country}
                    onChange={(e) => onFilterChange("country", e.target.value)}
                />
            </div>

            <div className="filter-group">
                <label className="filter-label" htmlFor="filter-city">
                    City
                </label>
                <input
                    id="filter-city"
                    type="text"
                    className="filter-input"
                    placeholder="Search..."
                    value={filters.city}
                    onChange={(e) => onFilterChange("city", e.target.value)}
                />
            </div>

            <div className="filter-group">
                <label className="filter-label" htmlFor="filter-visa-type">
                    Visa Type
                </label>
                <select
                    id="filter-visa-type"
                    className="filter-select"
                    value={filters.visaType}
                    onChange={(e) => onFilterChange("visaType", e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="Tourist">Tourist</option>
                    <option value="Business">Business</option>
                    <option value="Student">Student</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label" htmlFor="filter-status">
                    Status
                </label>
                <select
                    id="filter-status"
                    className="filter-select"
                    value={filters.status}
                    onChange={(e) => onFilterChange("status", e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Booked">Booked</option>
                    <option value="Expired">Expired</option>
                </select>
            </div>

            {hasActiveFilters && (
                <button className="btn btn-ghost btn-sm" onClick={onClearFilters}>
                    Clear Filters
                </button>
            )}
        </div>
    );
}
