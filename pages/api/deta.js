import { Deta } from 'deta'

const deta = Deta(process.env.DETA_KEY);

const base = deta.Base(process.env.DETA_BASE);

export default async function ExportDeta(req, res) {
    let { body, method } = req;
    let respBody = {};
  
    if (method === 'GET') {
        respBody = await base.fetch()
    } else if (method === 'POST') {
        respBody = await base.fetch().then(res => base.put(body, String(res.count + 1)));
        res.statusCode = 201;
    } else if (method === 'PUT') {
        const check = await base.get(body.id)
        const user = body?.user || body?.teamuser
        let password = body?.password
        let updates = {
          "usersFree": base.util.append(user)
        }
        if(user.team) {updates = {...updates, [`usersTeams.${user.team}`]: base.util.append(user)}
          if(check?.usersTeams[user?.team]) {
            if(check?.usersTeams[user?.team]?.some(i => i.email === user?.email)) {res.statusCode = 403}
            else if (check?.usersTeams[user?.team]?.length >= (check?.teams + 1)) {res.statusCode = 401}
          }
          else if(!check?.usersTeams[user.team]) {res.statusCode = 402}
        }
        if(check?.usersFree.some(i => i.email === user.email)) {res.statusCode = 403}
        if(check?.usersTeams[user.team]?.[0] !== password) {res.statusCode = 400}
        if(res.statusCode === 200) {
          respBody = await base.update(updates, body.id)
          res.statusCode = 201
        }
    } else if (method === 'PATCH') {
      let user = body?.teamuser
      let team = user?.team
      let password = body?.password
      const updates = {
        "usersFree": base.util.append(user),
        [`usersTeams.${team}`]: [password, user]
      }
      const check = await base.get(body?.id)
      if(check?.usersFree.some(i => i.email === user.email)) {res.statusCode = 403}
      else if(check?.usersTeams[body?.team]) {res.statusCode = 403}
      else if(res.statusCode = 200) {
        respBody = await base.update(updates, body?.id)
        res.statusCode = 201
      }
    } 
    res.json(respBody);
  }