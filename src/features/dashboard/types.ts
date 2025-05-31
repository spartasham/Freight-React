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