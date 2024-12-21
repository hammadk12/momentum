// Layout for each page eg: header, footer, etc
"use client"
import "@radix-ui/themes/styles.css";
import "./globals.css";
import Providers from "./components/Providers";
import SigninButton from "./components/SigninButton";
import { Theme, Heading, Button, Flex, Container, Box, Text } from "@radix-ui/themes";


export default function RootLayout({ children }) {



  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Theme
          accentColor="indigo"
          grayColor="auto"
          panelBackground="translucent"
          radius="medium"
          scaling="100%"
          appearance="dark"
          >
          <Flex direction='column' align='center' mt='300px' justify='center'>
            <Heading mb='10px' size='9' align='center'>Welcome to Momentum!</Heading>

            <SigninButton />
          </Flex>
          </Theme>
      </Providers>
      </body>
    </html>
  );
}


