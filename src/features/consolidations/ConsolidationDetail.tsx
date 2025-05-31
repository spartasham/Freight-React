import { useEffect } from 'react'
import {
  Box,
  Dialog,
  Portal,
  Heading,
  Text,
  List,
  Button,
  Spinner,
  Center,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { useGetConsolidationByIdQuery } from '../../api/shipmentsApi'
import { unparse } from 'papaparse'

interface ConsolidationDetailProps {
  /**
   * ID of the consolidation to fetch and display.
   * If null, the modal is closed.
   */
  consolidationId: number | null
  /**
   * Function to call when the user wants to close the detail view.
   */
  onClose: () => void
}

export default function ConsolidationDetail({
  consolidationId,
  onClose,
}: ConsolidationDetailProps) {
  // 1️⃣ Prepare string ID for the hook; skip if null
  const strId = consolidationId?.toString() ?? ''
  const {
    data: consolidation,
    isLoading,
    isError,
    refetch,
  } = useGetConsolidationByIdQuery(strId, {
    skip: consolidationId === null,
  })

  // 2️⃣ If consolidationId changes, re-trigger fetch
  useEffect(() => {
    if (consolidationId !== null) {
      refetch()
    }
  }, [consolidationId, refetch])

  // 3️⃣ Handler to download all shipments as CSV
  const handleDownloadCsv = () => {
    if (!consolidation) return

    // Convert shipments array into objects
    const rows = consolidation.shipments.map((id: string) => ({
      shipment_id: id,
    }))

    // Use papaparse to convert to CSV string
    const csvString = unparse(rows)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `consolidation_${consolidation.destination}_${consolidation.departure_date}_details.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    // 4️⃣ Use Dialog instead of Modal
    <Dialog.Root open={consolidationId !== null} onOpenChange={onClose}>
      <Portal>
      <Dialog.Backdrop />
      <Dialog.Content maxW="lg" borderRadius="md">
        <Dialog.Header>
            <Heading size="lg">Consolidation Details</Heading>
          </Dialog.Header>
        <Dialog.CloseTrigger asChild>
            <Button position="absolute" top={2} right={2} variant="ghost">
              ×
            </Button>
          </Dialog.CloseTrigger>

        <Dialog.Body>
            {/* 5️⃣ Loading state */}
          {isLoading && (
            <Center py={10}>
              <Spinner size="xl" />
            </Center>
          )}
            
            {/* 6️⃣ Error state */}
          {isError && (
            <Center py={10}>
              <Text color="red.500">Failed to load consolidation details.</Text>
            </Center>
          )}
            
                
            {!isLoading && !isError && !consolidation && (
                <Center py={10}>
                <Text color="gray.500">No consolidation found.</Text>
                </Center>
            )}

            {/* 7️⃣ Consolidation details */}
          {consolidation && (
            <VStack align="start" gap={4} py={4} px={2}>
                {/* Consolidation ID */}
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Consolidation ID:
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  {consolidation.id}
                </Text>
              </Box>

              {/* Destination */}
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Destination:
                </Text>
                <Text fontSize="lg">
                  {consolidation.destination}
                </Text>
              </Box>
                
                {/* Departure Date */}
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Departure Date:
                </Text>
                <Text fontSize="lg">
                  {consolidation.departure_date}
                </Text>
              </Box>

                {/* Total Weight and Volume */}
              <HStack gap={8}>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Total Weight:
                  </Text>
                  <Text fontSize="lg">
                    {consolidation.total_weight.toFixed(2)} kg
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Total Volume:
                  </Text>
                  <Text fontSize="lg">
                    {consolidation.total_volume.toFixed(2)} m³
                  </Text>
                </Box>
              </HStack>

                {/* Shipments List */}
              <Box w="100%">
                <Text fontSize="sm" color="gray.500" mb={2}>
                  Shipments ({consolidation.shipments.length}):
                </Text>
                <Box maxH="200px" overflowY="auto" borderWidth="1px" borderRadius="md" p={2}>
                  <List.Root gap={1}>
                    {consolidation.shipments.map((id: string) => (
                      <List.Item key={id}>
                        <Text fontSize="sm">{id}</Text>
                      </List.Item>
                    ))}
                  </List.Root>
                </Box>
              </Box>
            </VStack>
          )}
        </Dialog.Body>

        <Dialog.Footer>
          {consolidation && (
            <Button colorScheme="blue" mr={3} onClick={handleDownloadCsv}>
              Download Full CSV
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
      </Portal>
    </Dialog.Root>
  )
}
