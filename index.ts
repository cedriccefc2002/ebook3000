import { MSleepAsync, RequestAsync } from "./Lib";

import { load } from "cheerio";

/**
 * 抓取網址目錄
 */
const url = "http://ebook3000.siteunblock.xyz/Magazine/For-Men";

const imageBaseUrl = "https://ebook3000.siteunblock.xyz";
const bookFilter = /(http:\/\/longfiles.com\/[A-Za-z0-9_\-\/\.]*\.html)/;
const pageFilter = /(\w+)_(\d+)_(\d+).html/;

async function getBook(pageTitle: string, bookUrl: string) {
    const resp = await RequestAsync(bookUrl);
    if (resp.IsSuccess) {
        const $ = load(resp.Data);
        console.log(`## [${pageTitle}](${bookUrl})\n`);
        $("div.list_box").each((index, element) => {
            try {
                const box = $(element);
                const lit = `${box.find("div.list_box_lit img").attr("src")}`;
                const title = `${box.find("div.list_box_title").text()}`;
                const info = box.find("div.list_box_info").text();
                const match = bookFilter.exec(info);
                if (match) {
                    console.log(`![img](${imageBaseUrl}${lit})\n`);
                    console.log(`[${title.trim()}](${match[0]})\n`);
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
}

async function main() {
    const resp = await RequestAsync(`${url}/index.html`);
    const $ = load(resp.Data);
    console.log(`# [${url}](${url})\n`);
    const lastPage = $("div.change_page a:contains(Last)").attr("href");
    // console.log(`${lastPage}`);
    const match = pageFilter.exec(lastPage);
    if (match) {
        const total = parseInt(match[3], 10);
        for (let index = total; index >= 1; index--) {
            const pageTitle = `${match[2]}_${index}/${total}`;
            const bookurl = `${url}/${match[1]}_${match[2]}_${index}.html`;
            // console.log(bookurl);
            await getBook(pageTitle, bookurl);
        }
    }
}

main().finally(() => {
    process.exit();
});
