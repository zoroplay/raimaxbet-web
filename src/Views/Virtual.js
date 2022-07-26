import React, {useCallback, useEffect, useState} from 'react';
import { MD5 } from 'crypto-js';
import JackpotLayout from "./layout/JackpotLayout";
import {useSelector} from "react-redux";

export default function Virtual() {
    const {user, isAuthenticated} = useSelector((state) => state.auth);
    const [virtualUrl, setVirtuaUrl] = useState(null)
    const [mode, setMode] = useState(0);
    const [token, setToken] = useState('111111');
    const [hash, setHash] = useState('');
    const backurl = process.env.REACT_APP_URL;
    const privateKey = process.env.REACT_APP_XPRESS_PRIVATE_KEY;
    const group = process.env.REACT_APP_SITE_KEY;

    useEffect(() => {
        if (isAuthenticated) {
            setToken(user.auth_code+'-'+group);
            setMode(1);
        } else {
            setToken('111111');
            setMode(0);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        setHash(MD5(`${token}10100${backurl}${mode}${group}${privateKey}`).toString())
    }, [token, mode]);

    // useEffect(() => {
    //     const script = document.createElement('script')
    //     script.type = 'text/javascript';
    //     script.src = `${process.env.REACT_APP_GLOBALBET_PROD}/responsive/js/widgetIntegration.nocache.js`;
    //     script.async = true
    //     script.id = 'globalbet-script'
    //     document.body.appendChild(script);

    //     return () => {
    //         document.getElementById('globalbet-script').remove();
    //     }
    // }, []);

    // useEffect(() => {
    //     if (user.role === 'Player') {
    //         setVirtuaUrl(`${process.env.REACT_APP_GLOBALBET_PROD}/engine/web/autologin/account?login=${user.username}-BTK&code=${user.auth_code}&webRedirectTo=/responsive/ext/skinbs/vspro-headless.jsp%3Flocale=en_US%26agent=BTK_SHOP`);
    //     } else if (user.role === 'Cashier') {
    //         window.open(`${process.env.REACT_APP_GLOBALBET_PROD}/engine/shop/autologin/account?login=${user.username}-BTK&code=${user.auth_code}&shopRedirectTo=/client/shop.jsp%3Flocale=en_US`);
    //     } else {
    //         setVirtuaUrl(`${process.env.REACT_APP_GLOBALBET_PROD}/engine/web/autologin/account?webRedirectTo=/responsive/ext/skinbs/vspro-headless.jsp%3Flocale=en_US%26agent=BTK_SHOP`);
    //     }
    // }, [user]);

    // useEffect(() => {
    //     if (virtualUrl) {
    //         const container = document.getElementById("globalbet");
    //         container.innerHTML = '';
    //         setTimeout(() => {
    //             window.widgetAdapter.registerVirtualSports(container, virtualUrl, {sticky: true});
    //         }, 3000);
    //     }
    // }, [virtualUrl])

    return (
        <JackpotLayout>
            {/* <div id="globalbet" /> */}
            <iframe 
                title="casino" 
                style={{ width: '100%', border: 0, height: '100vh'}} 
                src={`${process.env.REACT_APP_XPRESS_LAUNCH_URL}?token=${token}&game=10100&backurl=${backurl}&mode=${mode}&group=${group}&h=${hash}`} />
        </JackpotLayout>
    )
}
