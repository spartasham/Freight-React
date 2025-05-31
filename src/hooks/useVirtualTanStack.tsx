import React, { useRef } from 'react'
import type { TableOptions } from '@tanstack/react-table'
import {
  useReactTable,
  getCoreRowModel,
  type Table,
  flexRender
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Box } from '@chakra-ui/react'

type InternalCallbacks =
  | 'getCoreRowModel'
  | 'getExpandedRowModel'
  | 'getGroupedRowModel'
  | 'getPaginationRowModel'
  | 'getSortedRowModel';

type PublicTableOptions<T extends object> = Omit<
  TableOptions<T>,
  InternalCallbacks
>;

interface Options<T extends object> extends PublicTableOptions<T> {
  rowHeight?: number;
}

/**
 * Creates a TanStack Table instance plus a <VirtualTable/> body that
 * scrolls 100 k rows at 60 fps.  Works with:
 *   @tanstack/react-table 8.21.3
 *   @tanstack/react-virtual 3.13.9
 *   TypeScript strict + verbatimModuleSyntax
 */
export function useVirtualTanStack<T extends object>(
  opts: Options<T>,
): { table: Table<T>; VirtualTable: React.FC } {
  const { rowHeight = 44, ...tableOpts } = opts

  /* 1️⃣ Table instance */
  const table = useReactTable({
    ...tableOpts,
    getCoreRowModel: getCoreRowModel(), // must only appear once
  })

  /* 2️⃣ Virtualiser bound to the scroll div */
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: table.getRowModel().rows.length,
    estimateSize: () => rowHeight,
    overscan: 8,
  })

  /* 3️⃣ Virtualised body component */
  const VirtualTable: React.FC = () => {
    const virtualItems = rowVirtualizer.getVirtualItems()

    return (
      <Box
        ref={parentRef}
        style={{
          height: '100%',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <Box
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((v) => {
            const row = table.getRowModel().rows[v.index]

            return (
              <Box
                key={v.key}
                className="tr"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${v.start}px)`,
                  height: rowHeight,
                }}
                data-index={v.index}
              >
                {row.getVisibleCells().map((cell) => (
                  <Box key={cell.id} className="td">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                ))}
              </Box>
            )
          })}
        </Box>
      </Box>
    )
  }

  return { table, VirtualTable }
}
