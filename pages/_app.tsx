import '@/styles/globals.scss'
import ApolloWrapper from '@/lib/apolloWrapper'
import PageWithLayout from '@/layout/page.layout'


type AppProps = {
  Component: PageWithLayout
  pageProps: any
}


export default function App({ Component, pageProps }: AppProps) {


  const Layout = Component.layout || (({ children }) => <>{children}</>)

  return (
    <ApolloWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloWrapper>
  )
}
