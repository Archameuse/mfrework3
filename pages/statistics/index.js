import Layout from "../../components/layout";
import styles from '../../styles/Stats.module.css'
import { animate, motion, AnimatePresence } from 'framer-motion'
import { useQuery, useQueryClient } from "react-query";
import axios from 'axios';
import { useState } from 'react'

export default function Statistics() {
    const [turn, setTurn] = useState()
    const queryClient = useQueryClient()
    const getRequest = () => {
        return axios.get('/api/sheetStats')
            .then(res => res.data)
    }


    const { data: stats } = useQuery(["Stats"], getRequest)
    return(
        <Layout>
            <main className={styles.body}>
            <div className={styles.cardsWrap}>
                {stats?.map((player, id) => (
                    <Card player={player} key={id} />
                ))}
            </div>
            </main>
        </Layout>
    )
}

function Card({player}) {
    const [flip, setFlip] = useState(true)
    var name = player[0]
    var pts = player[1]
    var games = player[2]
    var wins = player[3]
    var loses = player[4]
    var draws = player[5]
    var winrate = player[6]
    var rank = player[7]
    var club = player[19]
    return(
        <motion.div whileHover={{scale: 1.1}} animate={flip ? {rotateY: 0} : {rotateY: 180, scaleX: -1}} className={styles.card} onClick={() => setFlip(!flip)}>
           {flip ? (
            <div>
            <div className={styles.container_season}>
                <h1 className={styles.season}>Season 12</h1>
            </div>
            <div className={styles.container_name}>
                <h1 className={styles.name}>{name}</h1>
            </div>
            <div className={styles.container_stats}>
                <h3 className={styles.wins}>Победы: {wins}</h3>
                <h3 className={styles.loses}>Поражения: {loses}</h3>
                <h3 className={styles.loses}>Ничьи: {draws}</h3>
            </div>
                <div className={styles.container_rank}>
                <h2 className={styles.role}>Ранг: {rank}</h2>
                {club && (<h2 className={styles.club}>Club: {club}</h2>)}
            </div>
            </div>) : 
            (
            <div>
            <div className={styles.container_season}>
                <h1 className={styles.season}>Season 12</h1>
            </div>
            <div className={styles.container_name}>
                <h1 className={styles.name}>{name}</h1>
            </div>
            <div className={styles.container_stats}>
                <h3 className={styles.wins}>Победы: {wins}</h3>
                <h3 className={styles.loses}>Поражения: {loses}</h3>
                <h3 className={styles.loses}>Ничьи: {draws}</h3>
            </div>
                <div className={styles.container_rank}>
                <h2 className={styles.role}>PTS: {pts}</h2>
                {club && (<h2 className={styles.club}>Winrate: {winrate}%</h2>)}
            </div>
            </div>
            ) 
        }
        </motion.div>
    )
}