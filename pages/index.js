import Image from 'next/image'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import { motion, Reorder } from 'framer-motion'
import { useMainContext } from '../contexts/maincontext'
import { useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function Home() {
  const { homeText } = useMainContext()
  const [cards, setCards] = useState(homeText.cards)
  const [tapped, setTapped] = useState(false)
  const isPhone = useMediaQuery('(max-width: 768px)')
  const logo = {
    hover: { opacity: 0.05, y: "-150%" },
  }
  
  const list = {
    hover: { height: "fit-content" }
  }

  const video = {
    hover: { filter: 'blur(0px)'},
    initial : { filter: 'blur(3px)' }
  }

  return (
   <Layout>
      <motion.main className={styles.center} whileHover="hover" initial="initial" onClick={() => setTapped(!tapped)} animate={(isPhone && tapped) ? "hover" : {}}>
        <motion.video variants={video} className={styles.video} autoPlay loop muted>
          <source src='./Videos/mfforsite.mp4'/>
        </motion.video>
        <motion.div className={styles.logo} variants={logo} initial={{x: "-50%"}}/>
        <Reorder.Group values={cards} onReorder={setCards} axis="x" initial={{height: 0}} variants={list}>
          {cards.map((item) => (
            <Reorder.Item key={item.text} value={item}>
              <h1 style={isPhone ? {fontSize: 15} : {}}>{item.heading}</h1>
              <p style={isPhone ? {fontSize: 12} : {}}>{item.text}</p>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </motion.main>
   </Layout>
  )
}
