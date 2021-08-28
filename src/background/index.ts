import { sendMessageToContentScriptWithResponse } from '../popup/utils/chrome.message';

console.log('this is background script');

interface Message {
    type: 'http';
}

function httpRequest() {
    return fetch('https://jsonplaceholder.typicode.com/todos');
}

function listenAndRespondBackgroundMessaged(): void {
    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
        if (message.type === 'http') {
            httpRequest().then((res) => {
                res.json().then((data) => {
                    sendResponse(data);
                });
            });
        }
        return true; // this indicates that we will send response asynchronously
    });
}

listenAndRespondBackgroundMessaged();

var temp: any = [];
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case 'selector':
            temp = [...temp, { ...message.data, id: temp.length }];
            break;
        case 'getSelector':
            sendResponse(temp);
            break;
        case 'delete':
            let updated: any = [];
            temp.forEach((e: any, index: number) => {
                if (e.id !== message.id) {
                    updated[updated.length] = { ...e, id: updated.length };
                }
            });
            temp = updated;
            sendResponse(updated);
            break;
        case 'wholeDelete':
            temp = [];
            sendResponse([]);
            break;
        default:
            console.error('Unrecognised message: ', message);
    }
    chrome.runtime.sendMessage(temp);
});

console.log(temp);
