import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text } from '@chakra-ui/react';

interface UploadDropzoneProps {
  onFileAccepted: (file: File) => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileAccepted }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
  });

  return (
    <Box
      {...getRootProps()}
      border="2px dashed"
      borderColor="gray.200"
      p={8}
      textAlign="center"
      cursor="pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Text>Drop the CSV file here...</Text>
      ) : (
        <Text>Drag & drop a CSV file here, or click to select one.</Text>
      )}
    </Box>
  );
};

export default UploadDropzone;