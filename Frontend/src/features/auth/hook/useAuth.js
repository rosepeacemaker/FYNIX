import { setUser } from "../state/auth.slice"
import { useDispatch } from "react-redux"
import { register, login } from "../services/auth.api"

export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {

        const data = await register({ email, contact, password, fullname, isSeller })

        dispatch(setUser(data.user))

        return data.user
    }

    async function handleLogin({ email, password }) {

        const data = await login({ email, password })
        dispatch(setUser(data.user))
        return data.user
    }


    return {
        handleRegister,
        handleLogin
    }

}
