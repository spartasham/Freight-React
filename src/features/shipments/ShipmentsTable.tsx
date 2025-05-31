// import React from 'react'
// import type { ColumnDef, HeaderGroup } from '@tanstack/react-table'
// import { flexRender } from '@tanstack/react-table'
// import { useShipmentsQuery } from '../../api/shipmentsApi'
// import { useVirtualTanStack } from '../../hooks/useVirtualTanStack'
// import { Box, Spinner, Text } from '@chakra-ui/react'

// export interface ShipmentDto {
//   shipment_id: string
//   destination: string
//   status: string
//   mode: string
//   departure_date: string
//   weight: number
// }

// interface Props {
//   filters: Record<string, any>
//   pageSize: number
//   onRowClick: (id: string) => void
// }

// const columns: ColumnDef<ShipmentDto>[] = [
//   {
//     accessorKey: 'shipment_id',
//     header: 'ID',
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: 'destination',
//     header: 'Destination',
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//   },
//   {
//     accessorKey: 'mode',
//     header: 'Mode',
//   },
//   {
//     accessorKey: 'departure_date',
//     header: 'Departure',
//   },
//   {
//     accessorKey: 'weight',
//     header: 'Weight (g)',
//   },
// ]

// const ShipmentsTable: React.FC<Props> = ({
//   filters,
//   pageSize
// }) => {
//   const { data, isLoading, isError } = useShipmentsQuery({
//     page: 1,
//     page_size: pageSize,
//     ...filters,
//   })

//   if (isLoading) {
//     return (
//       <Box textAlign="center" p={8}>
//         <Spinner size="xl" />
//       </Box>
//     )
//   }

//   if (isError || !data) {
//     return (
//       <Box textAlign="center" p={8}>
//         <Text color="red.500">Failed to load shipments.</Text>
//       </Box>
//     )
//   }

//   const rows = data.results

//   const { table, VirtualTable } = useVirtualTanStack<ShipmentDto>({
//     data: rows,
//     columns,
//     getRowId: (row) => row.shipment_id,
//     rowHeight: 48,
//   })

//   // attach click handler via setting onClick on row container
//   React.useEffect(() => {
//     // no-op
//   }, [table])

//   return (
//     <Box
//       borderWidth="1px"
//       borderRadius="md"
//       overflow="hidden"
//       height="600px"
//     >
//       {/* table header */}
//       <Box className="thead" display="grid" gridTemplateColumns="repeat(6, 1fr)" bg="gray.50" p={2}>
//         {table.getHeaderGroups().map((hg: HeaderGroup<ShipmentDto>) => (
//             <React.Fragment key={hg.id}>
//             {hg.headers.map((header) => (
//                 <Text key={header.id} fontWeight="bold">
//                 {header.isPlaceholder
//                     ? null
//                     : flexRender(header.column.columnDef.header, header.getContext())}
//                 </Text>
//             ))}
//             </React.Fragment>
//         ))}
//         </Box>

//       {/* virtual rows */}
//       <Box height="calc(100% - 40px)">
//         {/* wrap VirtualTable with a click-capturing layer */}
//         <VirtualTable />
//       </Box>
//     </Box>
//   )
// }

import { useMemo } from 'react'
import { useVirtualTanStack } from '../../hooks/useVirtualTanStack'
import { useShipmentsQuery } from '../../api/shipmentsApi'
import { Box, Spinner, Text } from '@chakra-ui/react'
import type { ShipmentDto } from '../../api/shipmentsApi'
import { flexRender } from '@tanstack/react-table'

interface ShipmentsTableProps {
  filters: { status?: string; destination?: string }
  pageSize: number
  onRowClick: (id: string) => void
}

export default function ShipmentsTable({
  filters,
  pageSize,
}: ShipmentsTableProps) {
  // ─── 1️⃣ ALL hooks at the top, in a fixed order ─────────────────────────

  // 1.1 Fetch shipments data via RTK Query
  //    (this hook must always be called, even if filters change)
  const {
    data: shipmentsData,   // { results: ShipmentDto[]; count: number; … }
    isLoading,
    isError,
  } = useShipmentsQuery({ ...filters, page_size: pageSize })

  // 1.2 Define columns using useMemo (must always be called)
  const columns = useMemo(
    () => [
      {
        header: 'Shipment ID',
        accessorKey: 'shipment_id',
      },
      {
        header: 'Origin',
        accessorKey: 'origin',
      },
      {
        header: 'Destination',
        accessorKey: 'destination',
      },
      {
        header: 'Status',
        accessorKey: 'status',
      },
      {
        accessorKey: 'mode',
        header: 'Mode',
      },
      {
        accessorKey: 'departure_date',
        header: 'Departure',
      },
      {
        accessorKey: 'weight',
        header: 'Weight (g)',
      },
    ],
    []
  )

  // 1.3 Call useVirtualTanStack unconditionally (even if shipmentsData is undefined)
  //     We pass an empty array if shipmentsData is not yet loaded.
  const dataArray: ShipmentDto[] = shipmentsData?.results ?? []
  const { table, VirtualTable } = useVirtualTanStack<ShipmentDto>({
    data: dataArray,
    columns,
    getRowId: (row) => row.shipment_id,
    rowHeight: 48,
  })

  // 1.4 (Optional) Any other hook calls must also go here, e.g.:
  //     const [selectedRow, setSelectedRow] = useState<string | null>(null);
  //     const someMemo = useMemo(() => computeSomething(...), [dataArray]);
  //     etc.

  // ─── 2️⃣ Early returns *after* all hooks ─────────────────────────────

  // While loading, render a spinner (hooks remain in place, above)
  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={2}>Loading shipments…</Text>
      </Box>
    )
  }

  // If there was an error, show a message (hooks remain in place, above)
  if (isError) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">Failed to load shipments.</Text>
      </Box>
    )
  }

  // If data is empty, show “no data” (still, hooks are unconditionally called above)
  if (!shipmentsData || shipmentsData.results.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text>No shipments found.</Text>
      </Box>
    )
  }

  // ─── 3️⃣ Final render (hooks & VirtualTable always initialized) ─────────
  return (
    <Box height="600px" overflow="hidden">
      {/* 
        3.1 Render the VirtualTable’s header row, column titles, etc.
        You might call table.getHeaderGroups() to render column headings.
      */}
      <Box as="table" width="100%" borderBottom="1px solid gray">
        <Box as="thead">
          {table.getHeaderGroups().map((headerGroup) => (
            <Box as="tr" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Box as="th" key={header.id} px={2} py={1} textAlign="left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* 
        3.2 Render the virtualized body:
        a) VirtualTable includes its own scrolling container (see your hook).
        b) Each “row” should have an onClick that calls onRowClick(row.id).
      */}
      <VirtualTable>
        {/*
          Optionally, if your useVirtualTanStack returns a VirtualTable component
          that renders only the <tbody> content, you can wrap it in a <table> here:

          <Box as="table" width="100%">
            <Box as="tbody">
              <VirtualTable /> 
            </Box>
          </Box>
        */}
      </VirtualTable>
    </Box>
  )
}
