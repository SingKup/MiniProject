import { useRouter } from 'next/router'
import { useEffect } from 'react'

const proAuth = WrappedComponent => {
    const Wrapper = props => {
        const { token } = props
        const router = useRouter()
        useEffect(() => {
            if (!token)
                router.push('/presentproduct')
            else
                router.push('/editproduct')
        }, [token])
        return (<WrappedComponent {...props} />)
    }
    return Wrapper
}

export default proAuth