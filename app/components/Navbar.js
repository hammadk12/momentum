import React from 'react'
import { Flex, Heading, Text, Container } from '@radix-ui/themes'


const Navbar = () => {

const getTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
        return "Good morning";
    } else if (hours < 18) {
        return "Good afternoon"
    } else {
        return "Good evening"
    }
}



  return (
    <div>
    <Container align='center'>
    <Heading size='4' align='center' mt='6'>Good Morning! </Heading>
    </Container>
    </div>
  )
}

export default Navbar