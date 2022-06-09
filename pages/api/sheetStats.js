import {google} from "googleapis"

export default async function HandlerSheetStats (req, res) {
    let { query, method } = req;
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.DB_KEY),
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      })

    const client = await auth.getClient();

    const sheets = google.sheets({ version: 'v4', auth: client });

    if (method === "GET"){
        const range = `User Stats!A1:T54`;
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.DB_ID,
          range
        })
        const data = response.data.values;
        data.shift()
        res.status(200).json(data)
    }
}