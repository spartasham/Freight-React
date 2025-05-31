import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { useConsolidationsQuery } from '../../api/shipmentsApi'
import Papa from 'papaparse'

interface ConsolidationDto {
  id: number
  destination: string
  departure_date: string
  total_weight: number
  total_volume: number
  shipments: string[]
}

export default function ConsolidationsPage() {
  // 1️⃣ Fetch consolidations
  const {
    data: consolidations,
    isLoading,
    isError,
  } = useConsolidationsQuery({})

  // 2️⃣ CSV download handler
  const handleDownloadCsv = (con: ConsolidationDto) => {
    // Convert shipments array to array-of-objects
    const dataToConvert = con.shipments.map((id) => ({
      shipment_id: id,
    }))
    const csvString = Papa.unparse(dataToConvert)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `consolidation_${con.destination}_${con.departure_date}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 3️⃣ Loading and error states
  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }
  if (isError || !consolidations) {
    return (
      <Center h="100vh">
        <Text color="red.500">Failed to load consolidations.</Text>
      </Center>
    )
  }

  // 4️⃣ Render grid of cards
  return (
    <Box p={6}>
      <Heading mb={6}>Consolidations</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {consolidations.results.map((con: ConsolidationDto) => (
          <Card.Root 
            key={con.id} 
            shadow="md" 
            borderRadius="md"
            _hover={{ shadow: 'xl', transform: 'scale(1.02)' }}
            transition="all 0.2s"
            >
            <CardHeader>
              <Heading size="md">
                {con.destination} – {con.departure_date}
              </Heading>
            </CardHeader>

            <CardBody>
              <Text fontSize="sm" mb={2}>
                Total Weight: {con.total_weight.toFixed(2)} kg
              </Text>
              <Text fontSize="sm" mb={2}>
                Total Volume: {con.total_volume.toFixed(2)} m³
              </Text>
              <Text fontSize="sm">
                Shipments: {con.shipments.length} (
                {con.shipments.slice(0, 3).join(', ')}
                {con.shipments.length > 3 ? ', …' : ''})
              </Text>
            </CardBody>

            <CardFooter>
              <Button
                colorScheme="blue"
                onClick={() => handleDownloadCsv(con)}
              >
                Download CSV
              </Button>
            </CardFooter>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  )
}
