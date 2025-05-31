import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ① Define a generic Paginated<T> to match DRF’s pagination format
export interface Paginated<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// ② MetricsDto – fields returned by GET /api/metrics/
export interface MetricCount {
    status: string;
    total: number;
}
export interface CarrierBreakdown {
    name: string;
    total: number;
}
export interface VolumeByMode {
    mode: string;
    total_volume: number;
}
export interface ShipmentsPerDay {
    date: string;
    count: number;
}

export interface MetricsDto {
    counts: MetricCount[];
    utilisation_pct: number;
    by_carrier: CarrierBreakdown[];
    volume_by_mode: VolumeByMode[];
    shipments_per_day: ShipmentsPerDay[];
}

// ③ ShipmentDto – fields for a single shipment (from your DRF serializer)
export interface ShipmentDto {
    shipment_id: string        // primary key used in URLs
    status: string
    origin: string
    destination: string
    departure_date: string     // e.g., "2025-05-01"
    arrival_date: string       // e.g., "2025-05-03"
    weight: number
    volume: number
    mode: string               // e.g., "air", "sea", etc.
    customer: string
    carrier: string
    created_at: string         // ISO datetime
    updated_at: string         // ISO datetime
    delivered_date: string | null
    // … include any other fields from your serializer
}

// ④ ConsolidationDto – fields for a single consolidation
export interface ConsolidationDto {
    id: number
    destination: string       // 3-letter code
    departure_date: string    // e.g., "2025-05-15"
    total_weight: number
    total_volume: number
    shipments: string[]       // array of shipment_id strings
    created_at?: string       // optional if your serializer returns it
    // … any additional fields
}

// ⑤ ShipmentsQuery – filters & pagination args for /api/shipments/
export interface ShipmentsQuery {
    page?: number             // if you want to request page 1,2,…
    page_size?: number        // if you want variable page sizes
    status?: string           // e.g. "received", "in-transit", "delivered"
    destination?: string      // e.g. "LAX"
    start_date?: string       // e.g. "2025-05-01"
    end_date?: string         // e.g. "2025-06-01"
    // … add other filters your DRF view supports
}

// ⑥ Create the RTK Query API slice
export const shipmentsApi = createApi({
    reducerPath: 'shipmentsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Imports', 'Metrics', 'Shipments', 'Consolidations'],

    endpoints: (builder) => ({
        // ────────────── 1) CSV Upload ──────────────
        uploadCsv: builder.mutation<{ id: number }, File>({
            query: (file) => {
                // We must send multipart/form-data. fetchBaseQuery
                // does not auto-detect File in body, so we construct FormData.
                const formData = new FormData()
                formData.append('file', file)
                return {
                    url: 'imports/',
                    method: 'POST',
                    body: formData,
                }
            },
            invalidatesTags: ['Imports'],
        }),

        // ────────────── 2) Import Progress ──────────────
        importProgress: builder.query<{ processed: number; total: number }, number>({
            // /api/imports/:id/progress/
            query: (id) => `imports/${id}/progress/`,
            providesTags: (_result, _error, id) => [
                { type: 'Imports', id },
            ],
        }),

        // ────────────── 3) Metrics ──────────────
        metrics: builder.query<MetricsDto, void>({
            query: () => 'metrics/',
            providesTags: ['Metrics'],
            // Polling can be achieved by setting `pollingInterval` in React hook.
            keepUnusedDataFor: 30, // seconds
        }),

        // ────────────── 4) Shipments List (paginated) ──────────────
        shipments: builder.query<Paginated<ShipmentDto>, ShipmentsQuery>({
            query: (params) => ({
                url: 'shipments/',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        // Provide a “LIST” tag
                        { type: 'Shipments' as const, id: 'LIST' },
                        // And individual tags for each shipment ID (optional)
                        ...result.results.map((shipment) => ({
                            type: 'Shipments' as const,
                            id: shipment.shipment_id,
                        })),
                    ]
                    : [{ type: 'Shipments', id: 'LIST' }],
        }),

        // ────────────── 5) Shipment Detail ──────────────
        shipmentDetail: builder.query<ShipmentDto, string>({
            query: (id) => `shipments/${id}/`,
            providesTags: (_result, _error, id) => [
                { type: 'Shipments', id },
            ],
        }),

        // ────────────── 6) Consolidations List (paginated) ──────────────
        consolidations: builder.query<Paginated<ConsolidationDto>, ShipmentsQuery>({
            // We reuse ShipmentsQuery for pagination args (e.g. page, page_size),
            // although DRF might not support `status`/`destination` here.
            query: (params) => ({
                url: 'consolidations/',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        { type: 'Consolidations' as const, id: 'LIST' },
                        ...result.results.map((con) => ({
                            type: 'Consolidations' as const,
                            id: con.id,
                        })),
                    ]
                    : [{ type: 'Consolidations', id: 'LIST' }],
        }),

        // ────────────── 7) Consolidation Detail ──────────────
        getConsolidationById: builder.query<ConsolidationDto, string>({
            query: (id) => `consolidations/${id}/`,
            providesTags: (_result, _error, id) => [
                { type: 'Consolidations', id },
            ],
        }),
    }),
})

// ⑦ Export auto-generated hooks for each endpoint
export const {
    useUploadCsvMutation,
    useImportProgressQuery,
    useMetricsQuery,
    useShipmentsQuery,
    useShipmentDetailQuery,
    useConsolidationsQuery,
    useGetConsolidationByIdQuery,
} = shipmentsApi
