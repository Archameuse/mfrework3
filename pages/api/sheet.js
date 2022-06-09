import {google} from "googleapis"

export default async function HandlerSheet (req, res) {
    let { body, method } = req;
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.DB_KEY),
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      })

    const client = await auth.getClient();

    const sheets = google.sheets({ version: 'v4', auth: client });

    if (method === "GET"){
        const range = `Tournaments`;
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.DB_NEWS_ID,
            range,
          });
        const data = response.data.values;
        let resData = []
        let names = data.shift()
        resData = data.map((item, index) => {
          let resObj = {
            id: index + 1
          }
          for (let i = 0; i < item.length; i++) {
            resObj[names[i]] = item[i]
          }
          return(
            resObj
          )
        })
        res.status(200).json(resData)
    }

    if (method === "POST"){
        const range = `Tournaments`;
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.DB_NEWS_ID,
            range: range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                "majorDimension": 'COLUMNS',
                "range": range,
                "values": body.article
            }
          });
          res.status(200).json('Success')
    }

    if (method === "DELETE"){
      var batchUpdateRequest = {
        "requests":
        [
          {
            "deleteDimension": {
              "range": {
                "sheetId": '0',
                "dimension": "ROWS",
                "startIndex": body.id - 1,
                "endIndex": body.id
              }
            }
          }
        ]}

      const range = `Tournaments!A2`;
      const response = await sheets.spreadsheets.batchUpdate({
            auth: auth,
            spreadsheetId: process.env.DB_NEWS_ID,
            resource: batchUpdateRequest
          });
      res.status(200).end()
    }
}