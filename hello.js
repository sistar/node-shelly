const http = require('http');
const host = '0.0.0.0';
const port = 3000;
let brightness = 0;

const requestListener = function (req, resA) {
   
    let inc = parseInt(new URL(req.url, `http://${req.headers.host}`).searchParams.get("inc"));
    console.log(inc);
    let query_dimmer = http.get('http://192.168.178.41/light/0', (res) => {
    
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('close', () => {
            let parsed_data = JSON.parse(data);
            brightness = parseInt(parsed_data['brightness']); 
            console.log('current brightness:' + brightness);  
            brightness = brightness + inc;
            const qs = 'http://192.168.178.41/light/0?brightness=' + brightness.toString();
            console.log('about to query: ' + qs)
            let request = http.get(qs, (res) => {
                if (res.statusCode !== 200) {
                    console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
                    res.resume();
                    resA.writeHead(200);
                    resA.end("Failed To set brightness to " + brightness);
                    return;
                } else {
                    console.log(res);
                    resA.writeHead(200);
                    resA.end("Set brightness to " + brightness);
                }});
        });
    });
    
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});