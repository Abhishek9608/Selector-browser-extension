import React, { useState, useEffect } from 'react';
//@ts-ignore
import style from './button.module.css';
import {
    sendChromeData,
    sendChromeMessage,
    sendMessageToContentScript,
    sendMessageToContentScriptWithResponse,
} from '../utils/chrome.message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/fontawesome-free-solid';

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

    useEffect(() => {
        chrome.runtime.sendMessage({ type: 'getSelector' }, function (getselector) {
            if (typeof getselector == 'undefined') {
                // That's kind of bad
            } else {
                // setSelector([...selector, getselector]);
                console.log(getselector);
                // let selector = getselector;
            }
        });
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            // sendResponse({})
            console.log(request);
            // selector = request;
            if (Array.isArray(request)) {
                setSelector(request);
            }
        });
    }, []);
    console.log(selector);

    function deleteHandler(id: number) {
        chrome.runtime.sendMessage({ type: 'delete', id: id }, function (getselector) {
            console.log(getselector);
            if (Array.isArray(getselector)) {
                setSelector(getselector);
            }
        });
    }

    function wholedeleteHandler() {
        chrome.runtime.sendMessage({ type: 'wholeDelete' }, function (getselector) {
            console.log(getselector);
            if (Array.isArray(getselector)) {
                setSelector(getselector);
            }
        });
    }

    return (
        <div>
            <div id={style.header}>
                <span> Element Locator</span>
                <div id={style.wholeDelete} onClick={wholedeleteHandler}>
                    <FontAwesomeIcon color="red" icon={faTrash} size="lg" />
                </div>
            </div>
            {/* <p>When You click on button, you will see alert in host page, this is with chrome messages</p> */}
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tag</th>
                        <th scope="col">XPath</th>
                        <th scope="col">Css selector</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {selector &&
                        selector.map((e: any, index) => (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{e.tag}</td>
                                <td>
                                    <div>
                                        <input id={style.scroll} value={e.XPath} />
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <input id={style.scroll} value={e.selector} />
                                    </div>
                                </td>

                                <td>
                                    <div onClick={() => deleteHandler(e.id)}>
                                        <FontAwesomeIcon color="red" icon={faTrash} size="lg" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default ButtonComponent;
