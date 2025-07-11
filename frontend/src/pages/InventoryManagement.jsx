import { useState, useCallback, useRef } from "react";
import { RefreshCcw, Search } from "lucide-react";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";

// Custom hook untuk debounce
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

const InventoryManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: inventoryList,
    isLoading,
    error,
  } = useInventories({
    page,
    limit,
    search: searchQuery,
  });

  return (
    <PengelolaSideBarMenu>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex border rounded-lg">
                <input
                  type="text"
                  placeholder="Search SKU, Description"
                  className="input input-bordered w-full"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => debouncedSearch(searchQuery)}
                  disabled={isLoading}
                >
                  <Search />
                </button>
              </div>
              <button
                className="btn rounded-lg btn-secondary"
                onClick={() => syncInventory()}
                disabled={isLoading || isSyncing}
              >
                <RefreshCcw className={isSyncing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Description</th>
                    <th>Vendor</th>
                    <th>Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryList?.data?.inventories?.map((item) => (
                    <tr key={item._id}>
                      <td>{item.sku}</td>
                      <td>{item.description}</td>
                      <td>{item.vendorName}</td>
                      <td>{new Date(item.lastSyncAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                className="btn btn-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="flex items-center">
                Page {page} of {inventoryList?.data?.pagination?.pages || 1}
              </span>
              <button
                className="btn btn-sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (inventoryList?.data?.pagination?.pages || 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </PengelolaSideBarMenu>
  );
};

export default InventoryManagement;
