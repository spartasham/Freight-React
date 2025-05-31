// src/features/shipments/ShipmentDetailDrawer.tsx
import React from 'react'
import {
  Portal,
  CloseButton,
  DrawerTrigger,
  DrawerRoot,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
} from '@chakra-ui/react'
import { useShipmentDetailQuery } from '../../api/shipmentsApi'
import { Spinner, Box, Text } from '@chakra-ui/react'

interface Props {
  id: string | null
  onClose: () => void
}

const ShipmentDetailDrawer: React.FC<Props> = ({ id, onClose }) => {
  const { data, isLoading } = useShipmentDetailQuery(id!, {
    skip: !id,
  })

  return (
    <Portal>
      <DrawerRoot open={Boolean(id)} onOpenChange={(o) => !o && onClose()}>
        {/* invisible trigger, we control via open prop */}
        <DrawerTrigger />
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent maxW="400px">
            <CloseButton
              position="absolute"
              top="8px"
              right="8px"
              onClick={onClose}
            />
            <DrawerHeader>
              Shipment Details{ id ? `: ${id}` : '' }
            </DrawerHeader>
            <DrawerBody>
              {isLoading || !data ? (
                <Spinner />
              ) : (
                <Box>
                  {Object.entries(data).map(([key, val]) => (
                    <Text key={key}>
                      <strong>{key}</strong>: {String(val)}
                    </Text>
                  ))}
                </Box>
              )}
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </Portal>
  )
}

export default ShipmentDetailDrawer
