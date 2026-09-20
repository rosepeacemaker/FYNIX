import React from 'react'
import Nav from '../features/shared/Components/Nav'
import { Outlet } from 'react-router'

const AppLayout = () => {
    return (
        <div className="min-h-screen flex flex-col pt-[68px] sm:pt-[72px]">
            <Nav />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout