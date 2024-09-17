import { StoreProvider } from '@/stores/StoreProvider'
import type { AppProps } from 'next/app'
import { CacheProvider, EmotionCache } from '@emotion/react'
import createEmotionCache from '../src/createEmotionCache'
import Head from 'next/head'
import { NextPage } from 'next'
import { AppGlobalStyles } from '@/layouts/AppGlobalStyles'
import { SnackbarProvider } from 'notistack'
import { SnackbarUtilsConfigurator } from '@/utils/SnackbarUtils'
import CheckCircle from '/public/icons/toast/check-circle.svg'
import Error from '/public/icons/toast/error.svg'
import InfoTip from '/public/icons/toast/info.svg'
import "./index.css";
// import { UserModalContextProvider } from '@/hooks/useUserModal'
// import PersonalityModal from '@/components/Modals/PersonalityModal'
// import { ModalContextProvider } from '@/hooks/useModal'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

// eslint-disable-next-line
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  Component: NextPageWithLayout
}

export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const getLayout = Component.getLayout ?? ((page: React.ReactNode) => page)

  return (
    <StoreProvider {...pageProps}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no" />
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
          <title>{'Hangout'}</title>
        </Head>
        <AppGlobalStyles>
          <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            iconVariant={{
              success: <CheckCircle />,
              error: <Error />,
              info: <InfoTip />,
            }}
          >
            <SnackbarUtilsConfigurator />
            {/* <ModalContextProvider> */}
              {/* <UserModalContextProvider> */}
                {getLayout(<Component {...pageProps} />)}
                {/* <PersonalityModal /> */}
              {/* </UserModalContextProvider> 
            </ModalContextProvider> */}
          </SnackbarProvider>
        </AppGlobalStyles>
      </CacheProvider>
    </StoreProvider>
  )
}

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />
// }
