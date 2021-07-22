import React from "react";

export default function BetListOutcome({outcome}) {
    return (
        <>
        {
            {
                0: <img src="/img/ScommesseEsito_3.gif" style={{borderWidth: '0px' }} />,
                1: <img src="/img/ScommesseEsito_1.gif" style={{borderWidth: '0px' }} />,
                2: <img src="/img/ScommesseEsito_2.gif" style={{borderWidth: '0px' }} />,
                3: <img src="/img/ScommesseEsito_4.gif" style={{borderWidth: '0px' }} />,
                4: <img src="/img/ScommesseEsito_5.gif" style={{borderWidth: '0px' }} />,
            }[outcome]
        }
        </>
    )
}
