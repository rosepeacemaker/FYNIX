import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

const Protected = ({ children, role = "BUYER" }) => {

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    if (loading) {
        return <div>
            <h2>loading....</h2>
        </div>
    }

    if (!user) {

        return <Navigate to="/login" />
    }
    if (user.role !== role) {
        return <Navigate to="/" />
    }

    return children;

};

export default Protected;
