import React, {useCallback, useEffect, useState} from 'react';

import JackpotLayout from "./layout/JackpotLayout";
import {useSelector} from "react-redux";

export default function Virtual() {
    const {user, isAuthenticated} = useSelector((state) => state.auth);
    const [virtualUrl, setVirtuaUrl] = useState(null)
    useEffect(() => {
        const script = document.createElement('script')
        script.type = 'text/javascript';
        script.src = "https://sportsbookengine-test.virtual-horizon.net/responsive/js/widgetIntegration.nocache.js";
        script.async = true
        script.id = 'globalbet-script'
        document.body.appendChild(script);

        return () => {
            document.getElementById('globalbet-script').remove();
        }
    }, []);

    useEffect(() => {
        if (user.role === 'Player') {
            setVirtuaUrl(`https://sportsbookengine.virtual-horizon.com/engine/web/autologin/account?login=${user.username}-P90&code=${user.auth_code}&webRedirectTo=/responsive/ext/skinbs/vspro-headless.jsp%3Flocale=en_US%26agent=P90_WEB`);
        } else if (user.role === 'Cashier') {
            window.open(`https://sportsbookengine.virtual-horizon.com/engine/shop/autologin/account?login=${user.username}-P90&code=${user.auth_code}&shopRedirectTo=/client/shop.jsp%3Flocale=en_US`);
        } else {
            setVirtuaUrl(`https://sportsbookengine.virtual-horizon.com/engine/web/autologin/account?webRedirectTo=/responsive/ext/skinbs/vspro-headless.jsp%3Flocale=en_US%26agent=P90_WEB`);
        }
    }, [user]);

    useEffect(() => {
        if (virtualUrl) {
            const container = document.getElementById("globalbet");
            container.innerHTML = '';
            setTimeout(() => {
                window.widgetAdapter.registerVirtualSports(container, virtualUrl, {sticky: true});
            }, 3000);
        }
    }, [virtualUrl])

    return (
        <JackpotLayout>
            <div id="globalbet" />
        </JackpotLayout>
    )
}
