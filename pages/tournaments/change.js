import { useRef, useState } from "react";
import Layout from "../../components/layout";
import styles from '../../styles/Tournaments.module.css'
import axios from 'axios'
import { useSession } from "next-auth/react";
import { useQueryClient, useQuery } from 'react-query'
import { Container, Center, Card, Badge, Button, Modal, Input, PasswordInput, NativeSelect } from "@mantine/core";
import { admins } from "../../public/admins";

export default function TourChange() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [modalId, setModalId] = useState(1)
  const getRequest = () => {
    return axios.get('/api/deta').then(res => res.data.items)
}

const { data: tournaments } = useQuery(["Tournaments"], getRequest)

function Status({status}) {
  if(status === 'REG') return <Badge color="green" style={{float: 'right'}}>Открыт</Badge>
  if(status === 'ONG') return <Badge color="blue" style={{float: 'right'}}>Идёт</Badge>
  if(status === 'CLS') return <Badge color="red" style={{float: 'right'}}>Закрыт</Badge>
  if(status === 'CLS') return <Badge color="black" style={{float: 'right'}}>Ошибка</Badge>
}

function handleModal(id) {
  setShowModal(true)
  setModalId(id)
}

async function handleSelect(e) {
  let status = () => {
    if (e.currentTarget.value === 'Идёт') return 'ONG'
    if (e.currentTarget.value === 'Закрыт') return 'CLS'
    if (e.currentTarget.value === 'Открыт') return 'REG'
    else return 'CLS'
  }
  const response = await axios.put('/api/Tourstart', {status: status(), id: modalId+1})
}

async function handleAgents() {
  const response = await axios.post('/api/Tourstart', {id: String(modalId+1)})
}
async function handleBracket() {
  const response = await axios.get('/api/Tourstart', {params: {id: String(modalId+1)}})
}
    
if (admins.includes(session?.user.email) && session ) {return(
<Layout>
<Container>
    {tournaments?.map((item, index) => (
        <div className={styles.homeMain} key={item.key}>
        <Card p="lg" shadow="xl" radius="sm" withBorder mb="xl">
            <Card.Section>
                <Status status={item.status}></Status>
            </Card.Section>
            <Card.Section>
            <h1 style={{textAlign: 'center'}}>{item.name}</h1>
            </Card.Section>
            <Card.Section>
            <h3 style={{textAlign: 'center'}}>{item.type}</h3>
            <Button style={{float: 'right'}} onClick={() => handleModal(index)}>Изменить</Button>
            </Card.Section>
        </Card>
    </div>
    ))}
    </Container>
    <Modal title={tournaments?.[modalId]?.name} opened={showModal} onClose={() => setShowModal(false)}>
      <NativeSelect
        value=''
        placeholder="Выберите статус"
        data={['Открыт', 'Идёт', 'Закрыт']}
        onChange={(e) => handleSelect(e)}
      />
      <Button mt='xl' onClick={() => handleAgents()}>Закинуть фриагентов</Button>
      <Button mt='xl' onClick={() => handleBracket()}>Зарандомить положение команд</Button>
    </Modal>
</Layout>
)} else {
  return (
  <Layout>
    <h1 style={{textAlign: 'center'}}>You have no permission to view this page</h1>
  </Layout>
)}
}