import { Deta } from 'deta'

const deta = Deta(process.env.DETA_KEY);

const base = deta.Base(process.env.DETA_BASE);

export default async function ExportTourstart(req, res) {
    let { body, method, query } = req;
    let respBody = {};

    function shuffle(array) {
      let currentIndex = array.length,  randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    }
  
    if (method === 'POST') {
      let db = await base.get(body.id)
      let unsort = shuffle(db.usersFree.filter(f => !f.team))
      let teamlimit = db.teams
      let unsortedTeamsAmount = Math.floor(unsort.length/teamlimit)
      let unsortTeams = {}

      
      for (let i = 0; i < unsortedTeamsAmount; i++) {
          unsortTeams[`usersTeams.unsorted_${i}`] = []
          unsort.slice((i*teamlimit), (i+1)*teamlimit).map((item) => {
              unsortTeams[`usersTeams.unsorted_${i}`].push(item)
          })
      }

      respBody = await base.update(unsortTeams, body.id)
    } if (method === 'PUT') {
      const updates = {
        "status": body.status
      }
      respBody = await base.update(updates, String(body.id))
    } if (method === 'GET') {
      let db = await base.get(query.id)
      const respArr = shuffle(Object.entries(db.usersTeams))
      let updates = {
        TeamsSort: respArr
      }
      respBody = await base.update(updates, query.id)
      res.statusCode = 201
    }

    res.json(respBody);
  }