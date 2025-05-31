import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Portal,
  Drawer as DrawerNS,
  CloseButton,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import { LuMenu } from "react-icons/lu"           // lucide-react icon
import { NavLink, Outlet } from "react-router-dom"

const links = [
  { label: "Upload", to: "/upload" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Shipments", to: "/shipments" },
  { label: "Consolidations", to: "/consolidations" },
]

const NavItem = ({ label, to }: { label: string; to: string }) => (
  <Link asChild>
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? 'active-nav' : undefined
      }
    >
      {label}
    </NavLink>
  </Link>
);

export default function AppShell() {
  const { open, setOpen } = useDisclosure()   // v3 signature

  return (
    <Box minH="100vh">
      {/* header */}
      <Flex
        as="header"
        bg="white"
        borderBottomWidth={1}
        borderColor="gray.200"
        px={4}
        py={2}
        align="center"
        justify="space-between"
        position="sticky"
        top={0}
        zIndex={1000}
      >
        <Box fontWeight="bold">GEMHS Freight</Box>

        {/* desktop nav */}
        <HStack gap={4} display={{ base: "none", md: "flex" }}>
          {links.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </HStack>

        {/* mobile hamburger */}
        <IconButton
          aria-label="Open menu"
          display={{ base: "inline-flex", md: "none" }}
          variant="ghost"
          onClick={() => setOpen(true)}
        >
          <LuMenu />
        </IconButton>
      </Flex>

      {/* mobile drawer */}
      <Portal>
        <DrawerNS.Root open={open} onOpenChange={() => setOpen(false)}>
          <DrawerNS.Backdrop />
          <DrawerNS.Content bg="white" w="250px">
            <VStack align="flex-start" p={6} gap={4}>
              <CloseButton onClick={() => setOpen(false)} />
              {links.map(({ to, label }) => (
                <Link asChild key={to} onClick={() => setOpen(false)}>
                  <NavLink to={to}>{label}</NavLink>
                </Link>
              ))}
            </VStack>
          </DrawerNS.Content>
        </DrawerNS.Root>
      </Portal>

      {/* routed page content */}
      <Box as="main" p={4} maxW="7xl" mx="auto">
        <Outlet />
      </Box>
    </Box>
  )
}
