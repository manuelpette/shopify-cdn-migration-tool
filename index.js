let migrateTrigger = document.getElementById("migrate-all");
let goToMaxPagination = document.getElementById("go-to-max-pagination");
let CDN_BASEPATH = '';

const mainScript = function() {
    const file_preview_element = document.querySelector('button[aria-label="anteprima"] img, button[aria-label="preview"] img');
    if(!file_preview_element) return window.alert('Sorry, I couldn\'t find any CND basepath in the current page!');

    CDN_BASEPATH = file_preview_element.getAttribute('src').split('/').slice(0, -1).join('/');

    console.log(CDN_BASEPATH);

    const saveImage = function (imageSrc, fileName) {
        var link = document.createElement("a");

        document.body.appendChild(link); // for Firefox

        link.setAttribute("href", imageSrc);
        link.setAttribute("download", fileName);
        link.click();
    }

    const getImageData = function (image) {
        let fileName = image.getAttribute('aria-label');
        let defSrc = `${CDN_BASEPATH}/${fileName}`;

        return {
            src: defSrc,
            fileName
        }
    }

    const findImages = function (imagesSelector) {
        const images = document.querySelectorAll(imagesSelector);
        if (!images) return window.alert(`Couldn't find any file link! Looking for: "${imageSelector}".`);

        const imagesData = Array.from(images).map(getImageData);
        const message = {
            storeUrl: window.location.host,
            images: imagesData
        };

        chrome.runtime.sendMessage(message, function(){
            console.log("Sending images data to service worker...");
        })
    }

    findImages('button[data-polaris-tooltip-activator="true"]');

    /* const images = document.querySelectorAll('[aria-label="anteprima"] img');
    if (images) {
        const imgs = Array.from(images);
        for (let i = 0; i < imgs.length; ++i) {
            let src = imgs[i].getAttribute('src');
            let defSrc = parseImageSrc(src);
            let fileName = defSrc.split('/').reverse()[0];
        }
    } */
}


function moveToMaxPagination() {
    if(window.location.href.indexOf('?limit=250') !== -1) return window.alert('You are already at pagination limit of 250 files!');

    const url = window.location.href.split('?');
    let new_url = `${url[0]}?limit=250`;

    if(url.length > 1) {
        new_url = `${url[0]}?limit=250&${url[0]}`;
    }

    document.location.href = new_url ;
}

goToMaxPagination.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: moveToMaxPagination,
    });
});

migrateTrigger.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: mainScript,
    });
});

