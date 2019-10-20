import { MSleepAsync, RequestAsync } from "./Lib";

import { load } from "cheerio";

const imageBaseUrl = "https://ebook3000.siteunblock.xyz";
const url = "http://ebook3000.siteunblock.xyz/Magazine/For-Men/index.html";

const filter = /(http:\/\/longfiles.com\/\w.+.pdf.html)/;

async function main() {
    const resp = await RequestAsync(url);
    const $ = load(resp.Data);
    console.log(`# [url](${url})\n`);
    $("div.list_box").each((index, element) => {
        const box = $(element);
        const lit = box.find("div.list_box_lit img").attr("src");
        const title = box.find("div.list_box_title").text();
        const info = box.find("div.list_box_info").text();
        const match = filter.exec(info);
        if (match) {
            console.log(`![img](${imageBaseUrl}${lit})\n`);
            console.log(`[${title}](${match[0]})\n`);
        }
    });
}

main().finally(() => {
    process.exit();
});
