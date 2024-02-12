import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './components/Home/Home'

function Layout() {
  return (
    <>
    <Header/>
    <Outlet />
    </>
  )
}

export default Layout