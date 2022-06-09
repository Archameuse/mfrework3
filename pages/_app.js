import '../styles/globals.css';
import { ContextProvider } from '../contexts/maincontext';
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from 'next-auth/react'




const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  return (
    <SessionProvider session={session}>
      <ContextProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ContextProvider>
    </SessionProvider>
  )
}

export default MyApp
