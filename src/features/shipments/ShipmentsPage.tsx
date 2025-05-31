import React, { useState } from 'react'
import {
  Box,
  HStack,
  Input,
  Heading,
  NativeSelect,
  Text,
} from '@chakra-ui/react'
import ShipmentsTable from './ShipmentsTable'
import ShipmentDetailDrawer from './ShipmentDetailDrawer'

const ShipmentsPage: React.FC = () => {
  const [status, setStatus] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <Box p={4}>
      <Heading mb={4}>Shipments</Heading>

      <HStack align="flex-end" gap={4} mb={4}>
        {/* 1️⃣ Use Chakra’s NativeSelect.Root + Field */}
        <Box>
          <Text fontSize="sm" mb={1}>
            Status
          </Text>
          <NativeSelect.Root size="md" width="200px">
            <NativeSelect.Field
              placeholder="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.currentTarget.value)}
            >
              <option value="">All</option>
              <option value="received">Received</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Input
          placeholder="Destination code"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          maxW="200px"
        />
      </HStack>

      <ShipmentsTable
        filters={{
          status: status || undefined,
          destination: destination || undefined,
        }}
        pageSize={500}
        onRowClick={(id) => setSelectedId(id)}
      />

      <ShipmentDetailDrawer
        id={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </Box>
  )
}

export default ShipmentsPage
