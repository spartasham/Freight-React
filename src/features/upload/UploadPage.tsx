import React, { useEffect, useState } from "react";
import { VStack, Box, Text, Spinner } from "@chakra-ui/react";
import { Progress } from "@chakra-ui/progress";
import { useNavigate } from "react-router-dom";
import UploadDropzone from "./UploadDropzone";
import {
    useUploadCsvMutation,
    useImportProgressQuery,
} from "../../api/shipmentsApi";
import { toaster } from "../../components/ui/toaster";

type UploadState = "idle" | "uploading" | "processing" | "error";

const UploadPage: React.FC = () => {
    const navigate = useNavigate();

    // 1️⃣ Mutation for uploading the CSV
    const [
        uploadCsv,
        { data: uploadData, isLoading: isUploading, isError: uploadError },
    ] = useUploadCsvMutation();

    // 2️⃣ We will track uploadState manually for better UI/UX
    const [uploadState, setUploadState] = useState<UploadState>("idle");

    // 3️⃣ importId comes from the upload response
    const importId = uploadData?.id;

    // 4️⃣ Query to poll import progress
    const { data: progress, isError: progressError } = useImportProgressQuery(
        importId!,
        {
            skip: !importId, // only start polling once we have an importId
            pollingInterval: 3000, // poll every 3 seconds
        }
    );

    // 5️⃣ Effect to move between UI states:
    //    a) As soon as we start uploading, set uploadState = 'uploading'
    //    b) Once uploadData arrives (importId), switch to 'processing'
    //    c) If progress indicates finished, navigate
    //    d) If any error occurs, switch to 'error'
    useEffect(() => {
        if (isUploading) {
            setUploadState("uploading");
        }
    }, [isUploading]);

    useEffect(() => {
        if (uploadError) {
            setUploadState("error");
            toaster.error({
                title: "Upload failed.",
                description: "Could not upload the CSV. Please try again.",
                duration: 3000,
                closable: true,
            });
        }
    }, [uploadError, toaster]);

    useEffect(() => {
        if (importId) {
            setUploadState("processing");
            toaster.create({
                title: "Processing upload...",
                description:
                    "Your CSV is being processed. This may take a while.",
                type: "loading",
                duration: 3000,
                closable: true,
            });
        }
    }, [importId, toaster]);

    useEffect(() => {
        if (progressError) {
            setUploadState("error");
            toaster.error({
                title: "Processing failed.",
                description:
                    "There was an error processing the CSV. Please try again.",
                duration: 3000,
                closable: true,
            });
        }
    }, [progressError, toaster]);

    useEffect(() => {
        if (
            progress &&
            progress.total > 0 &&
            progress.processed === progress.total
        ) {
            toaster.success({
                title: "Upload complete!",
                description:
                    "Your CSV has been successfully uploaded and processed.",
                duration: 3000,
                closable: true,
            });
            // Delay very slightly so the user sees 100% momentarily (optional)
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        }
    }, [progress, navigate, toaster]);

    // 6️⃣ Handler when the user drops/selects a file
    const handleFileAccepted = (file: File) => {
        // Optimistically flip to “uploading” state so the rest of the UI knows
        setUploadState("uploading");

        // 1️⃣ Dispatch the RTK Query mutation and unwrap it to a real Promise
        const uploadPromise = uploadCsv(file as any).unwrap();

        // 2️⃣ Let Chakra’s toaster track that Promise
        toaster.promise(uploadPromise, {
            loading: {
                title: "Uploading…",
                description: "Sending your CSV to the server.",
            },
            success: {
                title: "Upload complete!",
                description: "File received. Starting processing…",
            },
            error: {
                title: "Upload failed",
                description:
                    "Something went wrong while uploading. Please try again.",
            },
        });

        // 3️⃣ Update our local UI state based on the promise outcome
        uploadPromise
            .then(() => {
                // The mutation resolved; we should now be in “processing” state
                setUploadState("processing");
            })
            .catch(() => {
                // The mutation rejected; go to error state so the page shows an error block
                setUploadState("error");
            });
    };

    return (
        <VStack gap={6} p={8} align="center" w="100%" maxW="600px" mx="auto">
            {/* If we're not uploading or processing, show the dropzone */}
            {uploadState === "idle" && (
                <UploadDropzone onFileAccepted={handleFileAccepted} />
            )}

            {/* 7️⃣ Uploading */}
            {uploadState === "uploading" && (
                <Box textAlign="center" w="100%">
                    <Spinner size="xl" mb={4} />
                    <Text>Uploading file…</Text>
                </Box>
            )}

            {/* 8️⃣ Processing */}
            {uploadState === "processing" && (
                <Box w="100%">
                    {/* If total is still zero (or undefined), show an indeterminate bar */}
                    {progress && progress.total > 0 ? (
                        <>
                            <Text mb={2}>
                                Processed {progress.processed} /{" "}
                                {progress.total} rows
                            </Text>
                            <Progress
                                value={
                                    (progress.processed / progress.total) * 100
                                }
                                colorScheme="blue"
                            />
                        </>
                    ) : (
                        <>
                            <Text mb={2}>Processing file…</Text>
                            <Progress isIndeterminate colorScheme="blue" />
                        </>
                    )}
                </Box>
            )}

            {/* 9️⃣ Error state: if either upload or processing errored */}
            {uploadState === "error" && (
                <Text color="red.500">
                    Something went wrong. Please refresh and try again.
                </Text>
            )}
        </VStack>
    );
};

export default UploadPage;
