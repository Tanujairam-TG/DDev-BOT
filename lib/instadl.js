const axios = require("axios");
const { URLSearchParams } = require("url");
const { Script, createContext } = require("vm");

async function instadl() {
    const body = new URLSearchParams({
        "sf_url": encodeURI(arguments[0]),
        "sf_submit": "",
        "new": 2,
        "lang": "id",
        "app": "",
        "country": "id",
        "os": "window",
        "browser": "Chrome",
        "channel": "main",
        "sf-nomad": 1
    });

    try {
        const { data } = await axios({
            url: "https://worker.sf-tools.com/savefrom.php",
            method: "POST",
            data: body,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://id.savefrom.net",
                "referer": "https://id.savefrom.net/",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"
            }
        });

        let exec = '[]["filter"]["constructor"](b).call(a);';
        data = data.replace(exec, `\ntry {\ni++;\nif (i === 2) scriptResult = ${exec.split(".call")[0]}.toString();\nelse (\n${exec.replace(/;/, "")}\n);\n} catch {}`);

        const context = {
            scriptResult: "",
            i: 0
        };

        createContext(context);
        new Script(data).runInContext(context);

        return JSON.parse(context.scriptResult.split("window.parent.sf.videoResult.show(")?.[1].split(");")?.[0]);
    } catch (error) {
        console.error("Error in instadl:", error.message);
        throw error;
    }
}

module.exports = { instadl };
