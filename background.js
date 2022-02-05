let currentDomain = '';

chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
    suggest({filename: `${currentDomain}/${item.filename}` });
});

chrome.runtime.onMessage.addListener(function(message, callback) {
    console.log("Received images data!");
    currentDomain = message.storeUrl;

    message.images.map(function(image){
        chrome.downloads.download({
            url: image.src,
            filename: image.fileName
        });
    })
});
