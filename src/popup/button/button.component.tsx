import React, { useState, useEffect } from 'react';
//@ts-ignore
import style from './button.module.css';
import {
    sendChromeData,
    sendChromeMessage,
    sendMessageToContentScript,
    sendMessageToContentScriptWithResponse,
} from '../utils/chrome.message';

interface List {
    title: string;
}

// chrome.runtime.sendMessage({ type: 'getSelector' }, function (getselector) {
//     if (typeof getselector == 'undefined') {
//         // That's kind of bad
//     } else {
//         // setSelector([...selector, getselector]);
//         console.log(getselector);
//     }
// });

function ButtonComponent(): JSX.Element {
    const [state, setState] = useState('');

    const [response, setResponse] = useState('');

    const [list, setList] = useState<List[]>([]);
    const [selector, setSelector] = useState<List[]>([]);
    chrome.runtime.sendMessage({ type: 'getSelector' }, function (getselector) {
        if (typeof getselector == 'undefined') {
            // That's kind of bad
        } else {
            // setSelector([...selector, getselector]);
            console.log(getselector);
            let selector = getselector;
        }
    });

    useEffect(() => {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            // sendResponse({})
            console.log(request);
            // selector = request;
            setSelector(request);
        });
    }, []);
    console.log(selector);

    return (
        <div>
            <div id={style.header}>Element Locator</div>
            <p>When You click on button, you will see alert in host page, this is with chrome messages</p>
            {selector && selector.map((e: any) => <p>{e}</p>)}
        </div>
    );
}

export default ButtonComponent;
