const https = require('https');
const fs = require('fs');

const download = (url, path) => {
  https.get(url, (res) => {
    res.pipe(fs.createWriteStream(path));
  });
};

download('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/192px-Instagram_logo_2016.svg.png', 'public/icon-192.png');
download('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/512px-Instagram_logo_2016.svg.png', 'public/icon-512.png');
