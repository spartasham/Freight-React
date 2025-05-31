import React, { useEffect } from 'react';
import { VStack, Box, Text } from '@chakra-ui/react';
import { Progress } from '@chakra-ui/progress';
import { useNavigate } from 'react-router-dom';
import UploadDropzone from './UploadDropzone';
import {
  useUploadCsvMutation,
  useImportProgressQuery,
} from '../../api/shipmentsApi';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadCsv, { data: uploadData, isError }] = useUploadCsvMutation();
  const importId = uploadData?.id;
  const { data: progress } = useImportProgressQuery(importId!, {
    skip: !importId,
    pollingInterval: 3000,
  });

  useEffect(() => {
    if (progress && progress.processed === progress.total) {
      navigate('/dashboard');
    }
  }, [progress, navigate]);

  const handleFileAccepted = (file: File) => {
    uploadCsv(file as any);
  };

  return (
    <VStack gap={6} p={8} align="center">
      {!importId ? (
        <UploadDropzone onFileAccepted={handleFileAccepted} />
      ) : (
        <Box w="100%" maxW="600px">
          <Text mb={2}>
            Processed {progress?.processed ?? 0} / {progress?.total ?? 0} rows
          </Text>
          <Progress
            value={progress ? (progress.processed / progress.total) * 100 : 0}
          />
        </Box>
      )}
      {isError && <Text color="red.500">Upload failed. Please try again.</Text>}
    </VStack>
  );
};

export default UploadPage;