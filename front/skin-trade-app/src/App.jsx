import { useState } from 'react'

import PageManager from './PageManager'
import IndexPage from './pages/IndexPage'
import ProfilePage from './pages/ProfilePage'
import SteamLoginPage from './pages/SteamLoginPage'
import SellPage from './pages/SellPage'


function App() {

  return (
    <>
      <PageManager>
        <IndexPage name='/' />
        <IndexPage name='/index' />
        <ProfilePage name='/profile' authReq />
        <SellPage name='/sell' authReq />
        <SteamLoginPage name='/login' />
      </PageManager>
    </>
  )
}

export default App
