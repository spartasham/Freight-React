import React from 'react';
import { VStack, Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { useMetricsQuery } from '../../api/shipmentsApi';
import MetricCards from './MetricCards';
import CarrierBarChart from './CarrierBarChart';
import VolumePieChart from './VolumePieChart';

const DashboardPage: React.FC = () => {
  const { data, error, isLoading } = useMetricsQuery(undefined, {
    pollingInterval: 10000,
  });

  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading metrics...</Text>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box textAlign="center" mt={10}>
        <Text color="red.500">Failed to load metrics.</Text>
      </Box>
    );
  }

  return (
    <VStack gap={8} align="stretch" p={8}>
      <Heading size="lg">Dashboard</Heading>
      <MetricCards counts={data.counts} utilisation={data.utilisation_pct} />
      <Box>
        <Heading size="md" mb={4}>Shipments by Carrier</Heading>
        <CarrierBarChart data={data.by_carrier} />
      </Box>
      <Box>
        <Heading size="md" mb={4}>Volume by Mode</Heading>
        <VolumePieChart data={data.volume_by_mode} />
      </Box>
    </VStack>
  );
};

export default DashboardPage;