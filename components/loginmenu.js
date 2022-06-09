import { useSession, signIn, signOut } from "next-auth/react"
import { Login, Logout, News, Tournament } from 'tabler-icons-react'
import { ActionIcon, Avatar, Modal, Button } from '@mantine/core';
import { useState } from 'react'
import { animate, motion, AnimatePresence } from 'framer-motion'
import styles from '../styles/LoginMenu.module.css'
import Link from "next/link";
import { admins } from "../public/admins";

export default function LoginMenu() {
    const { data: session } = useSession()
    const [showMenu, setShowMenu] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const admin = admins.includes(session?.user.email)
    if(session) {
        

        return(
            <aside className={styles.aside}>
            <AnimatePresence>
            {showMenu && (
            <motion.ul initial={{height: 0, opacity: 0}} exit={{height: 0, opacity: 0}} animate={{height: 'fit-content', opacity: 1}}>
                {admin && (
                <ActionIcon onClick={() => setShowModal(true)} color="dark" radius="xs" variant="outline" size="lg">
                    <Tournament/>
                </ActionIcon>
                )}
                {admin && (<Link href='/news/add'>
                <ActionIcon color="dark" radius="xs" variant="outline" size="lg">
                    <News/>
                </ActionIcon>
                </Link>)}
                <ActionIcon onClick={() => signOut()} color="dark" radius="xs" variant="outline" size="lg">
                    <Logout/>
                </ActionIcon>
            </motion.ul>)}
            </AnimatePresence>
            <motion.div className={styles.avatar} animate={showMenu ? {rotateZ: 180} : {rotateZ: 0}}>
            <ActionIcon onClick={() => setShowMenu(!showMenu)} color="dark" radius="xs" variant="outline" size="lg">
                <Avatar src={session?.user.image}/>
            </ActionIcon>
            </motion.div>
            <Modal title="Создать или изменить турнир?" opened={showModal} onClose={() => setShowModal(false)}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <Link href='/tournaments/add'><Button>Создать</Button></Link>
                <Link href='/tournaments/change'><Button>Изменить</Button></Link>
                </div>
            </Modal>
            </aside>
        )}

    return(
        <div style={{position: "fixed", bottom: 10, right: 30}}>
        <ActionIcon onClick={() => signIn()} color="dark" radius="xs" variant="outline" size="lg">
            <Login />
        </ActionIcon>
        </div>
    )

    
}

{/* <AnimatePresence>
{showMenu && (
<motion.ul initial={{height: 0}} exit={{height: 0}} animate={{height: 'fit-content'}}>
    <li>asd</li>
    <li>dsa</li>
</motion.ul>)}
</AnimatePresence> */}