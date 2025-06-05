/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useEffect, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../../../packages/ui/src/table";
import { MonthSelector } from "@acme/ui/month-selector";
import { Button } from "@acme/ui/button";
import { ApiKeysModal } from "./api-keys-modal";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface AwinTransaction {
  id: number;
  advertiserId: number;
  publisherId: number;
  siteName: string;
  commissionStatus: string;
  commissionAmount: {
    amount: number;
    currency: string;
  };
  saleAmount: {
    amount: number;
    currency: string;
  };
  customerCountry: string;
  clickDate: string;
  transactionDate: string;
  validationDate: string;
  type: string;
  voucherCodeUsed: boolean;
  voucherCode: string | null;
  clickDevice: string;
  transactionDevice: string;
  customerAcquisition: string;
  publisherUrl: string;
  orderRef: string;
}

interface PlatformSummary {
  platform: string;
  data: any[];
  status: "success" | "error" | "loading";
  error?: string;
}

interface Filters {
  site: string;
  minCommission: string;
  maxCommission: string;
  minSale: string;
  maxSale: string;
}

type SortField = "saleAmount" | "commissionAmount" | null;
type SortOrder = "asc" | "desc";

export const APIList = () => {
  const [platformData, setPlatformData] = useState<PlatformSummary[]>([
    { platform: "ShareASale", data: [], status: "loading" },
    { platform: "Awin", data: [], status: "loading" },
    { platform: "Impact", data: [], status: "loading" },
    { platform: "Rakuten", data: [], status: "loading" },
  ]);

  const [filters, setFilters] = useState<Filters>({
    site: "",
    minCommission: "",
    maxCommission: "",
    minSale: "",
    maxSale: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    order: SortOrder;
  }>({
    field: null,
    order: "desc",
  });

  const [selectedMonth, setSelectedMonth] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const [filteredData, setFilteredData] =
    useState<PlatformSummary[]>(platformData);

  // Add state for custom chart
  const [chartTitle, setChartTitle] = useState("My Custom Chart");
  const [isCreatingChart, setIsCreatingChart] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    shareASaleToken: "",
    shareASaleSecretKey: "",
    awinKey: "",
    impactKey: "",
    everflowKey: "",
    cjKey: "",
    rakutenKey: "",
    rakutenSecret: "",
    partnerizeKey: "",
  });

  // Add this useEffect to fetch current API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetch("/api/organization/keys");
        if (response.ok) {
          const data = await response.json();
          setApiKeys(data);
        }
      } catch (error) {
        console.error("Error fetching API keys:", error);
      }
    };

    void fetchApiKeys();
  }, []);

  // Function to save a chart
  const handleSaveChart = async (chartData: any) => {
    try {
      const response = await fetch("/api/charts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chartData),
      });

      if (!response.ok) {
        throw new Error("Failed to save chart");
      }

      // Reset creating state after saving
      setIsCreatingChart(false);
      alert("Chart saved successfully!");
    } catch (error) {
      console.error("Error saving chart:", error);
      alert("Failed to save chart. Please try again.");
    }
  };

  // Toggle platform selection
  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  // Toggle metric selection
  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric],
    );
  };

  // Prepare chart data based on selections
  const getChartData = () => {
    // Filter data based on selected platforms
    const filteredPlatforms = filteredData.filter((platform) =>
      selectedPlatforms.includes(platform.platform),
    );

    // Get labels (we'll use platform names)
    const labels = filteredPlatforms.map((p) => p.platform);

    // Create datasets based on selected metrics
    const datasets = [];

    if (selectedMetrics.includes("sales")) {
      datasets.push({
        label: "Sales",
        data: filteredPlatforms.map((p) => getPlatformTotals(p.data).sales),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      });
    }

    if (selectedMetrics.includes("commission")) {
      datasets.push({
        label: "Commission",
        data: filteredPlatforms.map(
          (p) => getPlatformTotals(p.data).commission,
        ),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      });
    }

    if (selectedMetrics.includes("transactions")) {
      datasets.push({
        label: "Transactions",
        data: filteredPlatforms.map(
          (p) => getPlatformTotals(p.data).transactions,
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      });
    }

    return { labels, datasets };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [shareASaleRes, awinRes, impactRes, rakutenRes] = await Promise.all([
          fetch("/api/affiliate/shareasale"),
          fetch(`/api/affiliate/awin${selectedMonth ? `?month=${selectedMonth}` : ''}`),
          fetch("/api/affiliate/impact"),
          fetch(`/api/affiliate/rakuten${selectedMonth ? `?month=${selectedMonth}` : ''}`),
        ]);

        const [shareASaleData, awinData, impactData, rakutenData] = await Promise.all([
          shareASaleRes.json(),
          awinRes.json(),
          impactRes.json(),
          rakutenRes.json(),
        ]);

        console.log('API responses:', { awinData, rakutenData });

        const newPlatformData: PlatformSummary[] = [
          {
            platform: "ShareASale",
            data: Array.isArray(shareASaleData) ? shareASaleData : [],
            status: shareASaleRes.ok ? ("success" as const) : ("error" as const),
            error: shareASaleData.error,
          },
          {
            platform: "Awin",
            data: awinData.transactions || (Array.isArray(awinData) ? awinData : []),
            status: awinRes.ok ? ("success" as const) : ("error" as const),
            error: awinData.error,
          },
          {
            platform: "Impact",
            data: Array.isArray(impactData) ? impactData : [],
            status: impactRes.ok ? ("success" as const) : ("error" as const),
            error: impactData.error,
          },
          {
            platform: "Rakuten",
            data: rakutenData.transactions || (Array.isArray(rakutenData) ? rakutenData : []),
            status: rakutenRes.ok ? ("success" as const) : ("error" as const),
            error: rakutenData.error,
          },
        ];

        setPlatformData(newPlatformData);
        setFilteredData(newPlatformData);
      } catch (error) {
        setPlatformData((prev) =>
          prev.map((item) => ({
            ...item,
            status: "error",
            error: "Failed to fetch data",
          })),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [selectedMonth]);

  // Apply filters to the data
  useEffect(() => {
    const filtered = platformData.map((platform) => ({
      ...platform,
      data: platform.data.filter((item: AwinTransaction) => {
        const matchesSite =
          !filters.site ||
          (item.siteName && item.siteName.toLowerCase().includes(filters.site.toLowerCase()));

        const commission = item.commissionAmount?.amount || 0;
        const matchesCommission =
          (!filters.minCommission ||
            commission >= parseFloat(filters.minCommission)) &&
          (!filters.maxCommission ||
            commission <= parseFloat(filters.maxCommission));

        const sale = item.saleAmount?.amount || 0;
        const matchesSale =
          (!filters.minSale || sale >= parseFloat(filters.minSale)) &&
          (!filters.maxSale || sale <= parseFloat(filters.maxSale));

        return matchesSite && matchesCommission && matchesSale;
      }),
    }));

    setFilteredData(filtered);
  }, [filters, platformData]);

  // Calculate platform totals
  const getPlatformTotals = (data: any[]) => {
    return data.reduce(
      (acc, item) => ({
        sales: acc.sales + (item.saleAmount?.amount ?? 0),
        commission: acc.commission + (item.commissionAmount?.amount ?? 0),
        transactions: acc.transactions + 1,
      }),
      { sales: 0, commission: 0, transactions: 0 },
    );
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc",
    }));
  };

  const getSortedData = (data: AwinTransaction[]) => {
    if (!sortConfig.field) return data;

    return [...data].sort((a, b) => {
      const aValue = sortConfig.field && a[sortConfig.field]?.amount ? a[sortConfig.field].amount : 0;
      const bValue = sortConfig.field && b[sortConfig.field]?.amount ? b[sortConfig.field].amount : 0;

      if (sortConfig.order === "asc") {
        return aValue - bValue;
      }
      return bValue - aValue;
    });
  };

  return (
    <div className="flex flex-col">
      {/* Add the blank chart section */}
      <div className="mb-8">
        {!isCreatingChart ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Create Custom Chart</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add a custom chart to visualize your platform data
            </p>
            <button
              onClick={() => setIsCreatingChart(true)}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Create New Chart
            </button>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">Custom Chart</h3>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className="ml-4 rounded-md border bg-background px-3 py-1 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Chart title"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsCreatingChart(false)}
                  className="rounded-md border bg-background px-3 py-1 text-sm text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleSaveChart({
                      title: chartTitle,
                      options: {
                        responsive: true,
                        plugins: {
                          legend: { position: "top" },
                          title: { display: true, text: chartTitle },
                        },
                      },
                      data: getChartData(),
                    })
                  }
                  className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  disabled={
                    selectedPlatforms.length === 0 ||
                    selectedMetrics.length === 0
                  }
                >
                  Save Chart
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium">Select Data Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {platformData.map((platform) => (
                    <button
                      key={platform.platform}
                      onClick={() => togglePlatform(platform.platform)}
                      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                        selectedPlatforms.includes(platform.platform)
                          ? "border border-primary/30 bg-primary/10 text-primary"
                          : "border bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {platform.platform}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Select Metrics</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleMetric("sales")}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      selectedMetrics.includes("sales")
                        ? "border border-primary/30 bg-primary/10 text-primary"
                        : "border bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Sales
                  </button>
                  <button
                    onClick={() => toggleMetric("commission")}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      selectedMetrics.includes("commission")
                        ? "border border-primary/30 bg-primary/10 text-primary"
                        : "border bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Commission
                  </button>
                  <button
                    onClick={() => toggleMetric("transactions")}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      selectedMetrics.includes("transactions")
                        ? "border border-primary/30 bg-primary/10 text-primary"
                        : "border bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Transactions
                  </button>
                </div>
              </div>
            </div>

            <div className="h-80 w-full">
              {selectedPlatforms.length > 0 && selectedMetrics.length > 0 ? (
                <Line
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: chartTitle },
                    },
                  }}
                  data={getChartData()}
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25">
                  <p className="text-muted-foreground">
                    Select platforms and metrics to generate chart
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Platform Data</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit API Keys
          </Button>
        <MonthSelector
          onSelect={setSelectedMonth}
          isLoading={isLoading}
          selectedMonth={selectedMonth}
        />
      </div>
      </div>

      {/* Add the ApiKeysModal */}
      <ApiKeysModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={apiKeys}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>Total Sales</TableHead>
            <TableHead>Total Commission</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((platform, index) => {
            const totals = getPlatformTotals(platform.data);
            return (
              <TableRow key={index}>
                <TableCell>{platform.platform}</TableCell>
                <TableCell>
                  {platform.status === "loading" ? (
                    <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                  ) : (
                    `$${totals.sales.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {platform.status === "loading" ? (
                    <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  ) : (
                    `$${totals.commission.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {platform.status === "loading" ? (
                    <div className="h-4 w-8 animate-pulse rounded bg-muted" />
                  ) : (
                    totals.transactions
                  )}
                </TableCell>
                <TableCell>
                  {platform.status === "loading" ? (
                    <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  ) : platform.status === "error" ? (
                    <span className="text-destructive">{platform.error}</span>
                  ) : (
                    <span className="text-green-500 dark:text-green-400">success</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Awin Transactions Table */}
      {(() => {
        const awinPlatform = filteredData.find((p) => p.platform === "Awin");
        const awinData = awinPlatform?.data ?? [];

        console.log('Awin data for table:', awinData);
        
        // If there's no data or the data is empty, don't show the table
        if (!awinData || awinData.length === 0) {
          console.log('No Awin data to display');
          return null;
        }

        const sortedData = getSortedData(awinData);

        return (
          <div className="mt-4">
            <h3 className="mb-4 text-lg font-semibold">
              Awin Transactions ({awinData.length})
            </h3>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="flex flex-col">
                <label
                  htmlFor="site"
                  className="mb-1 text-sm font-medium text-foreground"
                >
                  Site Name
                </label>
                <input
                  type="text"
                  id="site"
                  name="site"
                  value={filters.site}
                  onChange={handleFilterChange}
                  placeholder="Filter by site name"
                  className="rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="minCommission"
                  className="mb-1 text-sm font-medium text-foreground"
                >
                  Min Commission
                </label>
                <input
                  type="number"
                  id="minCommission"
                  name="minCommission"
                  value={filters.minCommission}
                  onChange={handleFilterChange}
                  placeholder="Min amount"
                  className="rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="maxCommission"
                  className="mb-1 text-sm font-medium text-foreground"
                >
                  Max Commission
                </label>
                <input
                  type="number"
                  id="maxCommission"
                  name="maxCommission"
                  value={filters.maxCommission}
                  onChange={handleFilterChange}
                  placeholder="Max amount"
                  className="rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="minSale"
                  className="mb-1 text-sm font-medium text-foreground"
                >
                  Min Sale Amount
                </label>
                <input
                  type="number"
                  id="minSale"
                  name="minSale"
                  value={filters.minSale}
                  onChange={handleFilterChange}
                  placeholder="Min amount"
                  className="rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="maxSale"
                  className="mb-1 text-sm font-medium text-foreground"
                >
                  Max Sale Amount
                </label>
                <input
                  type="number"
                  id="maxSale"
                  name="maxSale"
                  value={filters.maxSale}
                  onChange={handleFilterChange}
                  placeholder="Max amount"
                  className="rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Ref</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    onClick={() => handleSort("saleAmount")}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    Sale Amount{" "}
                    {sortConfig.field === "saleAmount" && (
                      <span>{sortConfig.order === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("commissionAmount")}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    Commission{" "}
                    {sortConfig.field === "commissionAmount" && (
                      <span>{sortConfig.order === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Dates</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item: AwinTransaction) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.orderRef}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.siteName}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.publisherUrl}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 text-xs ${
                          item.commissionStatus === "approved"
                            ? "bg-green-100 text-green-800"
                            : item.commissionStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.commissionStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.saleAmount?.currency || ''}{" "}
                      {item.saleAmount?.amount ? item.saleAmount.amount.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell>
                      {item.commissionAmount?.currency || ''}{" "}
                      {item.commissionAmount?.amount ? item.commissionAmount.amount.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.type}</span>
                        {item.voucherCodeUsed && (
                          <span className="text-xs text-muted-foreground">
                            Voucher: {item.voucherCode}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{item.customerCountry}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.customerAcquisition}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.clickDevice} → {item.transactionDevice}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span>
                          Click: {item.clickDate ? new Date(item.clickDate).toLocaleDateString() : 'N/A'}
                        </span>
                        <span>
                          Trans:{" "}
                          {item.transactionDate ? new Date(item.transactionDate).toLocaleDateString() : 'N/A'}
                        </span>
                        <span>
                          Valid:{" "}
                          {item.validationDate ? new Date(item.validationDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })()}
    </div>
  );
};
