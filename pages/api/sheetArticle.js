import {google} from "googleapis"

export default async function HandlerSheetArticle (req, res) {
    let { query, method } = req;
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.DB_KEY),
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      })

    const client = await auth.getClient();

    const sheets = google.sheets({ version: 'v4', auth: client });

    if (method === "GET"){
        const id = parseInt(query?.id) + 1
        const rangeNames = `Tournaments!A1:I1`;
        const range = `Tournaments!A${id}:I${id}`
        const namesRes = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.DB_NEWS_ID,
            range: rangeNames,
          });
        const names = namesRes.data.values[0]
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.DB_NEWS_ID,
          range
        })
        const data = response.data.values[0];
        let resObj = {}
        for (let i = 0; i < data.length; i++) {
          resObj[names[i]] = data[i]
        }
        res.status(200).json(resObj)
    }
}