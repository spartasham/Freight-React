import React from 'react';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import type { MetricsDto } from './types';

interface MetricCardsProps {
  counts: MetricsDto['counts'];
  utilisation: number;
}

const MetricCards: React.FC<MetricCardsProps> = ({ counts, utilisation }) => (
  <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
    {counts.map(({ status, total }) => (
      <Box key={status} p={4} borderWidth="1px" borderRadius="md">
        <Text fontSize="sm" color="gray.500">
          {status.replace('-', ' ').toUpperCase()}
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
          {total}
        </Text>
      </Box>
    ))}
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontSize="sm" color="gray.500">
        Utilisation %
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        {utilisation.toFixed(1)}%
      </Text>
    </Box>
  </SimpleGrid>
);

export default MetricCards;