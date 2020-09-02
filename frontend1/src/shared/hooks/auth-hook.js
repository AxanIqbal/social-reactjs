import {useCallback, useEffect, useState} from "react";

let logOutTimer;

export function useAuth() {
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(false);
    const [userName, setUserName] = useState(false);
    const [tokenExpireDate, setTokenExpireDate] = useState();

    const login = useCallback((uid, uname, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        setUserName(uname);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpireDate(tokenExpirationDate);

        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                userName: uname,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, [])

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpireDate(null);
        setUserName(null);
        localStorage.removeItem('userData');
    }, [])

    useEffect(() => {
        if (token && tokenExpireDate) {
            const remainingTime = tokenExpireDate.getTime() - new Date().getTime()
            logOutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logOutTimer);
        }
    }, [token, logout, tokenExpireDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.userName, storedData.token)
        }
    }, [login]);

    return {token, login, logout, userId, userName}
}