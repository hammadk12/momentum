// Layout for each page eg: header, footer, etc
"use client";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import Providers from "./components/Providers";
import { Theme } from "@radix-ui/themes";

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <title>Momentum</title>
          <link rel='apple-touch-icon' href="/image/logo.png"/>
          <meta name="theme-color" content="#000000"/>
          <link rel="manifest" href="/manifest.json"/>
        </head>
      <body>
          <Theme
            accentColor="indigo"
            grayColor="auto"
            panelBackground="translucent"
            radius="medium"
            scaling="100%"
            appearance="dark"
          >
            <Providers>
            {children}
            </Providers>
          </Theme>
      </body>
    </html>
  );
}


