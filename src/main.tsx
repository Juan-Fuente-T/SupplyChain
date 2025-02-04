import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {RainbowKitProvider,darkTheme,getDefaultConfig} from '@rainbow-me/rainbowkit'
// import { sepolia } from 'wagmi/chains'
import { arbitrumSepolia} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

export const config = getDefaultConfig({
  appName: 'Supply Chain',
  projectId: import.meta.env.VITE_PROJECT_ID,
  // chains: [sepolia],
  chains: [arbitrumSepolia],
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
        {/* <RainbowKitProvider theme={lightTheme()}> */}
        {/* <RainbowKitProvider theme={midnightTheme()}> */}
          <App />
          <ToastContainer />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
