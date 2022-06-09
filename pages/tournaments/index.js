import Layout from "../../components/layout";
import axios from 'axios'
import { useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { Container, Center, Card, Badge, Button, Modal, Input, PasswordInput, Tooltip } from "@mantine/core";
import styles from '../../styles/Tournaments.module.css'
import { useSession } from 'next-auth/react'
import { useForm } from "@mantine/hooks";



export default function Tournaments() {
    const { data:session, status } = useSession()
    const user = session?.user
    const queryClient = useQueryClient()

    const [showModal, setShowModal] = useState(false)
    const [modalId, setModalId] = useState(1)
    const [showBracket, setShowBracket] = useState(false)
    const [bracketId, setBracketId] = useState(1)

    if(user?.team) delete user.team
    if(user?.password) delete user.password
    const getRequest = () => {
        return axios.get('/api/deta').then(res => res.data.items)
    }

    const { data: tournaments } = useQuery(["Tournaments"], getRequest)

   

    function handleModal(id) {
        setShowModal(true)
        setModalId(id)
    }
    function handleBracket(index) {
        setShowBracket(true)
        setBracketId(index)
    }

    return(
    <Layout>
    <Container>
    {tournaments?.map((item, index) => {
        let registered = item.usersFree.some(i => i.email === user?.email)
    return(
        <div className={styles.homeMain} key={item.key}>
        <Card p="lg" shadow="xl" radius="sm" withBorder>
            <Card.Section>
                <Status status={item.status}></Status>
            </Card.Section>
            <Card.Section>
            <h1 style={{textAlign: 'center'}}>{item.name}</h1>
            </Card.Section>
            <Card.Section>
            <h3 style={{textAlign: 'center'}}>{item.type}</h3>
            </Card.Section>
            <Card.Section>
            <h5 style={{textAlign: 'center'}}>{item.descr}</h5>
            </Card.Section>
            {(user && item.status === 'REG') && (<Card.Section>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '30px'}}>
                <ButtonReg registered={registered} user={user} id={item.key} />
                <ButtonTeamReg registered={registered} id={item.key} onclick={() => handleModal(item.key)} teams={item.teams}/>
            </div>
            </Card.Section>)}
            {(item.status === 'ONG') && (<Card.Section>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '30px'}}>
                <Button onClick={() => handleBracket(index)}>Сетка</Button>
            </div>
            </Card.Section>)}
        </Card>
    </div>
    )})}
    </Container>
    <TeamRegModal id={modalId} onclose={() => setShowModal(false)} opened={showModal} user={user}/>
    <Modal title={tournaments?.[bracketId]?.name} onClose={() => setShowBracket(false)} opened={showBracket}>
        <div style={{display: 'flex', flexDirection: 'column', marginTop: 20, textAlign: 'center'}}>
        {tournaments?.[bracketId]?.TeamsSort?.map((item, index) => (
            <Tooltip key={index} label={item[1].map((value) => value.name + ' ')}><h4 key={item[0]}>{item[0]}</h4></Tooltip>
        ))}
        </div>
    </Modal>
    </Layout>
    )
}


function Status({status}) {
    if(status === 'REG') return <Badge color="green" style={{float: 'right'}}>Открыт</Badge>
    if(status === 'ONG') return <Badge color="blue" style={{float: 'right'}}>Идёт</Badge>
    if(status === 'CLS') return <Badge color="red" style={{float: 'right'}}>Закрыт</Badge>
    if(status === 'CLS') return <Badge color="black" style={{float: 'right'}}>Ошибка</Badge>
  }

function ButtonReg({registered, user, id}) {
return(
    <Button variant="outline" disabled={registered} onClick={() => handleSoloReg(user, id)}>
        Регистрация соло
    </Button>
)
}

function ButtonTeamReg({registered, onclick, teams}) {
    if (teams <= 1) registered = true
return(
    <Button disabled={registered} onClick={onclick}>
        Регистрация тима
    </Button>
)
}



function TeamRegModal({opened, onclose, id, user}) {
    let [page, setPage] = useState(1)
    let form = useForm({        
        initialValues: {
            id: id,
            team: '',
            password: ''
        }})

if (page === 2) {
    return(
        <Modal opened={opened} onClose={onclose} title="Создать команду">
            <form onSubmit={form.onSubmit((values) => {form.values.id = id; handleTeamCreate(values, user)})}>
            <Input placeholder='Название команды' {...form.getInputProps('team')}/>
            <PasswordInput placeholder='Пароль' mt="xl" {...form.getInputProps('password')}/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button mt="md" variant="outline" onClick={() => setPage(1)}>Регистрация</Button>
                <Button mt="md" type="submit">Создать</Button>
            </div>
            </form>
        </Modal>
    )
} else{
    return(
        <Modal opened={opened} onClose={onclose} title="Зайти в команду">
        <form onSubmit={form.onSubmit((values) => {form.values.id = id; handleTeamReg(values, user)})}>
            <Input placeholder='Название команды' {...form.getInputProps('team')} required/>
            <PasswordInput placeholder='Пароль' mt="xl" {...form.getInputProps('password')} required/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button mt="md" variant="outline" onClick={() => setPage(2)}>Создать команду</Button>
                <Button mt="md" type="submit">Регистрация</Button>
            </div>
        </form>
        </Modal>
        
    )
}

}


async function handleSoloReg(user, id) {
    try{
        await axios.put('/api/deta', {id, user})
    } catch(error) {
        console.log(error)
        if (error.response.status === 403) alert('You already registered')
        if (error.response.status === 402) alert('There is no such team')
        if (error.response.status === 401) alert('Team is full already')
    }
}

async function handleTeamReg(values, user) {
    let teamuser = {...user, team: values.team}
    let id = values.id
    let password = values.password
    try{
        await axios.put('/api/deta', {id, teamuser, password})
    } catch(error) {
        console.log(error)
        if (error.response.status === 403) alert('You already registered')
        if (error.response.status === 402) alert('There is no such team')
        if (error.response.status === 401) alert('Team is full already')
        if (error.response.status === 400) alert('Password incorrect')
    }
}

async function handleTeamCreate(values, user) {
    let teamuser = {...user, team: values.team}
    let id = values.id
    let password = values.password
    try{
        await axios.patch('/api/deta', {id, teamuser, password})
    } catch(error) {
        console.log(error)
        if (error.response.status === 403) alert('You already registered or team name was already taken')
    }
}