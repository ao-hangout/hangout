import { Html, Head, Main, NextScript } from 'next/document'
const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'PROD';
export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="theme-color" content="#00244D" />
        <link rel="shortcut icon" href="/logo.svg" />
        {isProd && (
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-RQEFVPDG3H"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-RQEFVPDG3H');
                `,
              }}
            />
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}