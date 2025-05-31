// src/hooks/useVirtualTanStack.tsx
import React from 'react'
import type { TableOptions } from '@tanstack/react-table'
import {
  useReactTable,
  getCoreRowModel,
  type Table,
  flexRender,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { chakra } from '@chakra-ui/react'

// Chakra‐styled <tr> and <td> so that `colSpan` (and other table props) work in v3
const Tr = chakra('tr')
const Td = chakra('td')

type InternalCallbacks =
  | 'getCoreRowModel'
  | 'getExpandedRowModel'
  | 'getGroupedRowModel'
  | 'getPaginationRowModel'
  | 'getSortedRowModel'

type PublicTableOptions<T extends object> = Omit<
  TableOptions<T>,
  InternalCallbacks
>

/**
 * Options for useVirtualTanStack:
 *  - Standard TanStack TableOptions<T> (columns, data, etc.)
 *  - Plus `rowHeight` (estimated pixel height of each row; defaults to 44)
 */
interface Options<T extends object> extends PublicTableOptions<T> {
  rowHeight?: number
}

/**
 * VirtualTableProps:
 *  - onRowClick: callback invoked with row’s unique ID when a row is clicked
 *  - scrollRef: React ref pointing to the actual scrollable container (<Box>)
 */
interface VirtualTableProps {
  onRowClick: (id: string) => void
  scrollRef: React.RefObject<HTMLDivElement | null>
}

/**
 * useVirtualTanStack:
 *  - Returns a TanStack Table instance (`table`)
 *  - Returns a React component (`VirtualTable`) that renders all <tr> / <td>
 *    inside <tbody> using virtualization
 *
 * Important for Chakra v3:
 *  - We cannot import <Tr> or <Td> directly, so we use `chakra('tr')` / `chakra('td')`
 *  - That ensures `colSpan` is accepted by TypeScript, and rows/cells are actual HTML elements
 */
export function useVirtualTanStack<T extends object>(
  opts: Options<T>
): { table: Table<T>; VirtualTable: React.FC<VirtualTableProps> } {
  const { rowHeight = 44, ...tableOpts } = opts

  // 1️⃣ Create the TanStack table instance
  const table = useReactTable({
    ...tableOpts,
    getCoreRowModel: getCoreRowModel(),
  })

  // 2️⃣ VirtualTable component definition (renders inside <tbody>)
  const VirtualTable: React.FC<VirtualTableProps> = ({ onRowClick, scrollRef }) => {
    // Configure useVirtualizer to use scrollRef.current as the scrolling element
    const rowVirtualizer = useVirtualizer({
      getScrollElement: () => scrollRef.current,
      count: table.getRowModel().rows.length,
      estimateSize: () => rowHeight,
      overscan: 8,
    })

    const virtualItems = rowVirtualizer.getVirtualItems()
    const totalSize = rowVirtualizer.getTotalSize()

    // Count visible leaf columns to set colSpan on the spacer
    const visibleLeafColumnsCount = table
      .getVisibleLeafColumns()
      .length

    return (
      <>
        {/**
         * 2.1 Invisible “spacer” <Tr> that reserves the total height of all rows:
         *     - height = totalSize (≈ number_of_rows × rowHeight)
         *     - visibility="hidden" so that it doesn’t show actual content
         *     - single <Td> with colSpan spans all columns
         *     - This <Tr> must be the first child inside <tbody>
         */}
        <Tr
          key="spacer"
          style={{ height: `${totalSize}px` }}
          visibility="hidden"
        >
          <Td colSpan={visibleLeafColumnsCount} p={0} m={0} />
        </Tr>

        {/**
         * 2.2 For each virtual item, render a real <Tr> absolutely positioned:
         *     - top = virtualRow.start (pixel offset)
         *     - left = 0, width = 100%, height = rowHeight
         *     - Each cell is a <Td> (display: table-cell by default in a real <tr>)
         *     - Because these <Tr> live inside a scrollable <Box> → <Tbody>,
         *       browser aligns each <Td> under the correct <Th>.
         */}
        {virtualItems.map((virtualRow) => {
          const row = table.getRowModel().rows[virtualRow.index]
          const top = virtualRow.start

          return (
            <Tr
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: `${top}px`,
                left: 0,
                width: '100%',
                height: `${rowHeight}px`,
              }}
              onClick={() => {
                // Assumes each row.original has a `shipment_id` property
                const id = (row.original as any).shipment_id as string
                onRowClick(id)
              }}
              _hover={{ bg: 'gray.50', cursor: 'pointer' }}
            >
              {row.getVisibleCells().map((cell) => (
                <Td
                  key={cell.id}
                  px={2}
                  py={1}
                  borderBottom="1px solid"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          )
        })}
      </>
    )
  }

  return { table, VirtualTable }
}
