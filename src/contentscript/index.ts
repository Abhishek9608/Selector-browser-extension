import { doc } from 'prettier';
import { finder } from '@medv/finder';
import getXPath from 'get-xpath';
console.log('this is content script');
// document.body.style.backgroundColor = '#000';

let ele = document.getElementsByClassName('MuiToolbar-root MuiToolbar-regular MuiToolbar-gutters');
let ele1 = document.getElementsByTagName('div');
console.log(ele, ele1);
var lastem: any;
document.onmouseover = function (e) {
    // console.log(e.target);
    if (lastem) {
        lastem.style.border = 'none';
    }
    var target: any = e.target;
    target.style.border = '1px solid #000';
    lastem = target;

    // target[0].click();
    // console.log(selector, 'selector');
};

var selector: any = [];
console.log('Got message from CS');
document.onclick = function (e) {
    console.log(e.target, 'click');
    let target: any = e.target;
    let newselector = finder(target, {
        seedMinLength: 10,
        optimizedMinLength: 6,
    });
    // console.log([...selector, newselector]);?
    //  ?
    let options = {
        selectorTypes: ['Tag'],
    };

    const newTag = target.tagName;

    const newXPath = getXPath(target);

    chrome.runtime.sendMessage({ type: 'selector', data: { selector: newselector, tag: newTag, XPath: newXPath } });
};

interface MessageWithResponse {
    name: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function listenToMessages(): void {
    chrome.runtime.onMessage.addListener((message) => {
        console.log(message);
    });
}

function listenAndRespond() {
    chrome.runtime.onMessage.addListener((message: MessageWithResponse, _sender, sendResponse) => {
        console.log('Got message from CS');
        setTimeout(() => {
            sendResponse(`Hello, ${message.name}`);
        }, 1000);
        return true; // this indicates that we will send response asynchronously
    });
}

listenToMessages();
listenAndRespond();
