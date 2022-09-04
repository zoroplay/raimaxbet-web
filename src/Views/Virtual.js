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
    const [group, setGroup] = useState(process.env.REACT_APP_SITE_KEY);
    const backurl = process.env.REACT_APP_URL;
    const privateKey = process.env.REACT_APP_XPRESS_PRIVATE_KEY;

    useEffect(() => {
        if (isAuthenticated) {
            setToken(user.auth_code);
            setMode(1);
            setGroup(user.group);
        } else {
            setToken('111111');
            setMode(0);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        setHash(MD5(`${token}10100${backurl}${mode}${group}${privateKey}`).toString())
    }, [token, mode]);


    return (
        <JackpotLayout>
            {/* <div id="globalbet" /> */}
            <iframe 
                title="casino" 
                style={{ width: '100%', border: 0, height: '400vh', overflow: 'scroll'}} 
                // style={{ width: '100%', border: 0, height: '100vh', overflow: scroll !important}} 
                src={`${process.env.REACT_APP_XPRESS_LAUNCH_URL}?token=${token}&game=10100&backurl=${backurl}&mode=${mode}&group=${group}&h=${hash}`} 
            />
        </JackpotLayout>
    )
}
