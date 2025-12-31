import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadTheme } from '../features/themeSlice'
import { Loader2Icon } from 'lucide-react'
import { useUser, SignIn, useAuth, CreateOrganization, useOrganizationList } from '@clerk/clerk-react'
import { fetchWorkspaces } from '../features/workspaceSlice'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { loading, workspaces } = useSelector((state) => state.workspace)
    const dispatch = useDispatch()
    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()
    const { isLoaded: isOrgListLoaded, userMemberships } = useOrganizationList({
        userMemberships: {
            infinite: true,
        }
    })

    // Initial load of theme
    useEffect(() => {
        dispatch(loadTheme())
    }, [])

    // Fetch workspaces when user is loaded OR when organizations change
    useEffect(() => {
        if (isLoaded && user && isOrgListLoaded) {
            dispatch(fetchWorkspaces({ getToken }))
        }
    }, [user, isLoaded, isOrgListLoaded, userMemberships?.count])

    if (!user || !isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen">
                <SignIn />
            </div>
        )
    }

    if (loading || !isOrgListLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2Icon className="size-7 animate-spin" />
            </div>
        )
    }

    if (user && workspaces.length === 0) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <CreateOrganization 
                    afterCreateOrganizationUrl="/dashboard"
                />
            </div>
        )
    }

    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout