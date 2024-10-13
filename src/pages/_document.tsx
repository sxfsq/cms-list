import { Head, Html, Main, NextScript } from "next/document";
import appManifest from "../../public/manifest.json";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="description" content={appManifest.description}></meta>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
