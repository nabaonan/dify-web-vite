import React from 'react'
import { Outlet } from 'react-router-dom'
import SwrInitializer from '@/app/components/swr-initializer'
import { AppContextProvider } from '@/context/app-context'
import GA, { GaType } from '@/app/components/base/ga'
import HeaderWrapper from '@/app/components/header/header-wrapper'
import Header from '@/app/components/header'
import { EventEmitterContextProvider } from '@/context/event-emitter'
import { ProviderContextProvider } from '@/context/provider-context'
import { ModalContextProvider } from '@/context/modal-context'
import GotoAnything from '@/app/components/goto-anything'

const Layout = () => {
  return (
    <div className="flex h-full flex-col">
      <GA gaType={GaType.admin} />
      <SwrInitializer>
        <AppContextProvider>
          <EventEmitterContextProvider>
            <ProviderContextProvider>
              <ModalContextProvider>
                <div className="flex min-h-0 grow flex-col">
                  <HeaderWrapper>
                    <Header />
                  </HeaderWrapper>
                  <Outlet />
                </div>
                <GotoAnything />
              </ModalContextProvider>
            </ProviderContextProvider>
          </EventEmitterContextProvider>
        </AppContextProvider>
      </SwrInitializer>
    </div>
  )
}
export default Layout
