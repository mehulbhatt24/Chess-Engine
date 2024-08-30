import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import { socket } from "../../connection/socket.js"
import { Box, Button, ButtonGroup, Input } from '@chakra-ui/react'
import { Container, VStack, HStack } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import GameContext from "../../Context/GameContext.js";

export default function CreateGame() {
    const Navigate = useNavigate();
    const toast = useToast()
    const { setGameid, setColor,isCreator } = useContext(GameContext);
    const [input, setInput] = useState('');
    const [select, setSelect] = useState('random');

    useEffect(() => {
        socket.on('joinRes', (res) => {
            res.gameid && setGameid(res.gameid)
            res.color && setColor(res.color)
            res.gameid && Navigate(`/game/${res.gameid}`)
            toast.closeAll()

            toast({
                title: res.msg && res.msg,
                // description: "We've created your account for you.",
                status: res.gameid?'success':'error',
                duration: 3000,
                isClosable: true,
            })
        })
    }, [])

    function create(event) {
        let clr = select;
        if (clr === 'random') {
            const clrs = ["white", "black"]
            const random = clrs[Math.floor(Math.random() * clrs.length)];
            setColor(random);
        }
        else setColor(clr)

        let _gameid = uuid();
        _gameid = _gameid.slice(0, 8);

        setGameid(_gameid);

        socket.emit("joinRoom", {gameid:_gameid,color:clr});
        isCreator.current = true
        Navigate(`/game/${_gameid}`)

    }
    function join(event) {
        socket.emit("joinReq", input);
        // setGameid(input)
        // setColor('black')
        // Navigate(`/game/${input}`)
    }

    return (
        <>
            <Tabs isFitted variant='enclosed' colorScheme='green'>
                <TabList mb='1em'>
                    <Tab _selected={{ color: 'white', bg: 'green.500' }} boxShadow='md'>Create Room</Tab>
                    <Tab _selected={{ color: 'white', bg: 'green.500' }} boxShadow='md'>Join Room</Tab>
                </TabList>
                <TabPanels>

                    <TabPanel >
                        <HStack spacing={4}>
                            <VStack w='50%'>
                                <div>Play As</div>
                                <Select defaultValue='random' onChange={(event) => setSelect(event.target.value)}>
                                    <option value='black'>Black</option>
                                    <option value='white'>White</option>
                                    <option value='random'>Random</option>
                                </Select>
                            </VStack>
                            <VStack w='50%'>
                                <Button w='100%' mt='30px' colorScheme='blue' width='200px' onClick={create}>Create Room</Button>
                            </VStack>

                        </HStack>
                    </TabPanel>
                    <TabPanel>
                        <HStack>
                            <Input w='50%' variant='filled' type='text' value={input} onChange={(event) => setInput(event.target.value)}></Input>
                            <Button margin='auto' colorScheme='blue' width='200px' onClick={join}>Join Room</Button>
                        </HStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>

    )
}