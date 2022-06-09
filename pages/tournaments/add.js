import { useRef } from "react";
import Layout from "../../components/layout";
import styles from '../../styles/Tournaments.module.css'
import axios from 'axios'
import { useSession } from "next-auth/react";
import { TextInput, Input, NumberInput, Slider, Textarea, Group, Button } from '@mantine/core'
import { useForm } from "@mantine/form";
import { admins } from "../../public/admins";

export default function TourAdd() {
  const { data: session } = useSession()
    const MARKS = [
        { value: 1, label: '1x1' },
        { value: 2, label: '2x2' },
        { value: 3, label: '3x3' },
        { value: 4, label: '4x4' },
        { value: 5, label: '5x5' },
      ];

    const form = useForm({
        initialValues: {
            name: '',
            type: '',
            teams: 1,
            date: new Date(),
            descr: '',
            status: 'REG',
            usersFree: [],
            usersTeams: []
        }
    })

//          Status enum (REG/ONG/CLS)

async function postRequest(tour) {
    let tourArr = Object.values(tour)
    let tourJSON = []
    tourArr.map((item) => {
        tourJSON.push({values: item})
    })

    const response = await axios('/api/deta', {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'Application/json',
          },
        data: JSON.stringify(tour)
    })
        
}

if (admins.includes(session?.user.email) && session ) {return(
<Layout>
    <main className={styles.addMain}>
    <form className={styles.addForm} onSubmit={form.onSubmit((values) => postRequest(values))}>
    <Input
      placeholder="Название турнира"
      {...form.getInputProps('name')}
      required
    />
    <Input
      placeholder="Тип турнира (краткая характеристика)"
      {...form.getInputProps('type')}
      required
    />
    <Slider
        label={(e) => `${e}x${e}`}
        defaultValue={1}
        step={1}
        marks={MARKS}
        styles={{ markLabel: { display: 'none' } }}
        min={1}
        max={5}
        style={{marginTop: 50, marginBottom: 50}}
        {...form.getInputProps('teams')}
    />
    <Textarea
      placeholder="Краткое описание турнира и его правил, дата проведения"
      label="Описание"
      {...form.getInputProps('descr')}
      required
    />
    <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
    </Group>
    </form>
    </main>
</Layout>
)} else {
  return (
  <Layout>
    <h1 style={{textAlign: 'center'}}>You have no permission to view this page</h1>
  </Layout>
)}
}