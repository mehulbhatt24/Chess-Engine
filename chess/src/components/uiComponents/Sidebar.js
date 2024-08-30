import React, { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHippo, faCocktail, faBullseye, faChessKnight, faMagnifyingGlassChart, faChess, faRobot, faBars } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

import {
    IconButton, Box, CloseButton, Flex, Icon, useColorModeValue, Text, Drawer, DrawerContent, useDisclosure, Center
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

// library.add(faBullseye, faHippo)
const LinkItems = [
    { name: 'New Game', icon: faChess, goto: "/game" },
    { name: 'Play Computer', icon: faRobot, goto: '/comp' },
    { name: 'Analyse', icon: faMagnifyingGlassChart, goto: '/game' },
    // { name: 'Favourites', icon: FiStar },
    // { name: 'Settings', icon: FiSettings },
]

export default function SimpleSidebar() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} navigate={navigate} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent >
                    <SidebarContent onClose={onClose} navigate={navigate} />
                </DrawerContent>
            </Drawer>
            <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
        </>
    )
}

const SidebarContent = ({ onClose, navigate, ...rest }) => {

    return (
        <Box
            bg={useColorModeValue('gray.100', 'gray.900')}
            borderRight="2px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: "20vw" }}
            pos="fixed"
            h="100vh"
            {...rest}>
            <Flex justifyContent={'center'}>
                <Flex h="20" align="center" w="80%" justifyContent="center">
                    
                    <Text fontSize="xl" fontFamily="monospace" fontWeight="bold" padding={3} >
                        Tacticon
                    </Text>
                  
                    {/* <FontAwesomeIcon icon="fa-solid fa-bullseye" />         have to do library.add for using icon like this */}
                    
                    <Text fontSize="xl" padding={3}>
                        <span className="fa-layers fa-fw fa-lg">
                            <FontAwesomeIcon icon={faBullseye} inverse style={{ background: "#DFCFBE", borderRadius: "10px" }} beat />
                            <FontAwesomeIcon icon={faChessKnight} transform="shrink-6" />
                        </span>


                    </Text>
                    
                </Flex>
                <Flex alignItems='center' justifyContent='center'>
                    <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
                </Flex>
            </Flex>
            <hr style={{marginBottom:"10px"}}/>
            {LinkItems.map((link) => (
                // <NavItem key={link.name} icon={link.icon}>
                <NavItem key={link.name} children={link.name} icon={link.icon} onClick={(e) => {
                    onClose()
                    navigate(link.goto, { replace: false })
                }} />
            ))}
        </Box>
    )
}

const NavItem = ({ icon, children, ...rest }) => {
    return (
        <Box
            as="a"
            href="#"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            
            <Flex
                align="center"
                justifyContent="space-around"
                p="4"
                mx="4"
                borderRadius="lg"
                
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>

                <Box width="200px">
                    {children}
                </Box>
                <Box>
                    {icon && (
                        <FontAwesomeIcon icon={icon} size='lg'/>
                    )}
                </Box>

            </Flex>
        </Box>
    )
}

const MobileNav = ({ onOpen, ...rest }) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent="flex-start"
            {...rest}>
            <Box>
                <FontAwesomeIcon icon={faBars} onClick={onOpen} size='lg' style={{ background: 'MistyRose', borderRadius: '5px', padding: '2px' }} />
            </Box>
            <Flex alignItems={'center'} justifyContent={'center'} w={'80%'}> 
                <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
                    Tacticon
                </Text>
                <Text fontSize="2xl" paddingLeft={3} paddingTop={2}>
                    <span className="fa-layers fa-fw fa-lg">
                        <FontAwesomeIcon icon={faBullseye} inverse style={{ background: "#DFCFBE", borderRadius: "10px" }} beat />
                        <FontAwesomeIcon icon={faChessKnight} transform="shrink-6" />
                    </span>


                </Text>
            </Flex>
        </Flex>
    )
}