// src/features/shipments/ShipmentsTable.tsx
import { useMemo } from 'react'
import { useShipmentsQuery } from '../../api/shipmentsApi'
import {
  Box,
  Spinner,
  Text,
  chakra
} from '@chakra-ui/react'

interface ShipmentsTableProps {
  filters: { status?: string; destination?: string }
  pageSize: number
  onRowClick: (id: string) => void
}

export default function ShipmentsTable({
  filters,
  pageSize,
  onRowClick,
}: ShipmentsTableProps) {
  // ─── 1️⃣ Fetch data ────────────────────────────────────────────
  const {
    data: shipmentsData,
    isLoading,
    isError,
  } = useShipmentsQuery({ ...filters, page_size: pageSize })

  // ─── 2️⃣ Define columns ────────────────────────────────────────
  // We only need the header labels here, since we're not using TanStack Table for this simple version
  const columns = useMemo(
    () => [
      { header: 'Shipment ID', accessor: 'shipment_id' },
      { header: 'Origin',      accessor: 'origin'      },
      { header: 'Destination', accessor: 'destination' },
      { header: 'Status',      accessor: 'status'      },
      { header: 'Mode',        accessor: 'mode'        },
      { header: 'Departure',   accessor: 'departure_date' },
      { header: 'Weight (g)',  accessor: 'weight'      },
    ] as const,
    []
  )

  // ─── 3️⃣ Early returns ─────────────────────────────────────────

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={2}>Loading shipments…</Text>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">Failed to load shipments.</Text>
      </Box>
    )
  }

  if (!shipmentsData || shipmentsData.results.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text>No shipments found.</Text>
      </Box>
    )
  }

  // ─── 4️⃣ Render static (non-virtualized) table ─────────────────────────
  return (
    <Box w="100%" overflowX="auto">
      <chakra.table
        width="100%"
        tableLayout="fixed"
        borderCollapse="collapse"
      >
        {/* ─── 4.1 Header ─────────────────────────────────────────────── */}
        
        <chakra.thead bg="gray.50" position="sticky" top="0" zIndex={1}>
          <chakra.tr>
            {columns.map((col) => (
              <chakra.th
                key={col.accessor}
                px={2}
                py={1}
                textAlign="left"
                borderBottom="1px solid"
              >
                {col.header}
              </chakra.th>
            ))}
          </chakra.tr>
        </chakra.thead>
        {/* ─── 4.2 Body ───────────────────────────────────────────────── */}
        <chakra.tbody>
          <chakra.tr key="spacer" style={{ height: "10px" }} visibility="hidden">
            <chakra.td colSpan={columns.length} p={0} m={0} />
          </chakra.tr>
          {shipmentsData.results.map((vr) => (
            <chakra.tr key={vr.shipment_id} style={{ position: 'relative' }}>
              {/* <chakra.td>{row.cells}</chakra.td> */}
              {columns.map((col) => (
                <chakra.td
                  key={col.accessor}
                  px={2}
                  py={1}
                  borderBottom="1px solid"
                  onClick={() => onRowClick(vr.shipment_id)}
                  _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                >
                  {vr[col.accessor]}
                </chakra.td>
              ))}
            </chakra.tr>
          ))}
        </chakra.tbody>
      </chakra.table>
    </Box>
  )
}
