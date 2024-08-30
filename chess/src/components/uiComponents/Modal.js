import { pieceImages } from '../FunctionsAndUtilities/Utils'
import '../../styles/Modal.css'
import { useRef } from 'react'
import { addPiece } from '../FunctionsAndUtilities/Logic'
import { socket } from '../../connection/socket'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Button,
    ButtonGroup,
    Box,
    Text,
    useDisclosure
} from '@chakra-ui/react'
import { useOutsideClick } from '@chakra-ui/react'



// function PromotionModal({ isOpen, onClose, clickedPos, x, y, color, setPieces,promotedPawn,gameid,Promotion,checkMate,PiecesRef,checkMateModalDisclosure }) {
function PromotionModal({boardObject, promotionModalDisclosure, checkMateModalDisclosure, Promotion, checkMate}) {
    let {color,setPieces,gameid,PiecesRef} = boardObject
    

    let xx = `${Promotion.x}px`
    let yy = `${Promotion.y}px`

    return (
        <>
            <Popover

                isOpen={promotionModalDisclosure.isOpen}
                onClose={promotionModalDisclosure.onClose}
                placement='bottom'
                closeOnBlur={false}
                onOverlayClick={() => console.log("hi")}
            >

                <PopoverContent border='none' opacity='1' w='200px' overflowX='auto' color='' bg='' borderColor='' pos="fixed" top={yy} left={xx}>


                    <PopoverArrow bg='' />
                    {/* <PopoverCloseButton /> */}
                    <PopoverBody >


                        <ButtonGroup bg='blue.700' p='2px' borderRadius='5' borderColor='black.400' size='sm' w='100%' display="flex" alignItems="center" justifyContent="space-between">
                            <Button colorScheme='green' onClick={(e) => addPiece('queen', boardObject,Promotion,checkMate,promotionModalDisclosure,checkMateModalDisclosure)}>{pieceImages.wqueen}</Button>
                            <Button colorScheme='green' onClick={(e) => addPiece('knight', boardObject,Promotion,checkMate,promotionModalDisclosure,checkMateModalDisclosure)}>{pieceImages.wknight}</Button>
                            <Button colorScheme='green' onClick={(e) => addPiece('rook', boardObject,Promotion,checkMate,promotionModalDisclosure,checkMateModalDisclosure)}>{pieceImages.wrook}</Button>
                            <Button colorScheme='green' onClick={(e) => addPiece('bishop', boardObject,Promotion,checkMate,promotionModalDisclosure,checkMateModalDisclosure)}>{pieceImages.wbishop}</Button>


                        </ButtonGroup>

                    </PopoverBody>

                </PopoverContent>


            </Popover>
        </>
    )
}

// function CheckMateModal({ isOpen,onClose,onOpen,checkMate, color }) {
function CheckMateModal({ boardObject,checkMateModalDisclosure, checkMate }) {

    let {color} = boardObject

    return (
        <>
            {/* <Button onClick={onOpen}>Open Modal</Button> */}

            <Modal isOpen={checkMateModalDisclosure.isOpen} onClose={checkMateModalDisclosure.onClose}>
                <ModalOverlay />
                <ModalContent background={"green.100"} h='400px'>
                    {
                        color === checkMate && <ModalHeader fontSize='30px' color='red.500' textAlign='center'>YOU LOSE</ModalHeader>
                    }
                    {
                        color !== checkMate && <ModalHeader fontSize='30px' color='green.500' textAlign='center' >YOU WON</ModalHeader>
                    }
                    <ModalCloseButton />
                    <ModalBody mt='50px'>
                        <Box display='flex' justifyContent='space-around' fontSize="20px" >
                            <Box>
                                <Box mb='15px'>{checkMate === "black" ? "white" : "black"}</Box>
                                <Box ml='10px' w='20px'>{checkMate==="black"?pieceImages.wpawn:pieceImages.bpawn}</Box>
                            </Box>
                            <Box pt='10px'>Defeated</Box>
                            <Box>
                                <Box mb='15px'>{checkMate==="black"?"black":"white"}</Box>
                                <Box ml='10px' w='20px'>{checkMate==="white"?pieceImages.wpawn:pieceImages.bpawn}</Box>
                            </Box>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button w='50%' colorScheme='blue' mr={3}>
                            Play Again
                        </Button>
                        <Button w='50%' colorScheme='blue' mr={3}>Analyse</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export { PromotionModal, CheckMateModal }