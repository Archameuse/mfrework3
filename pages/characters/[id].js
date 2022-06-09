import { useRouter } from "next/router";
import Layout from "../../components/layout";
import characters from "../../public/JSON/characters.json"
import styles from "../../styles/Characters.module.css"
import { PieChart } from 'react-minimal-pie-chart';
import { AnimatePresence, anime, motion, AnimateSharedLayout } from 'framer-motion'
import { useState } from "react";



export default function Character() {
const router = useRouter()
const character = characters?.characters[router.query.id-1]
const [gifID, setGifID] = useState(0)
const [tapped, setTapped] = useState(false)
const gifs = character?.abilities.map((item) => `/Characters/abilities/gif/${character.image}/${item.code}.gif`)
const list = {
    hover: {height: "100%"}
  };

  function AbilityList({ability}) {
    let isCD = !!ability?.cd
    return(
        <motion.div 
        initial={{height: 0}}
        className={styles.abilityList}
        variants={list}
        >
        <div className={styles.abilityName}>{`${ability?.name} (${ability?.code})`}</div>
        <div className={styles.abilityDescr}>
            {isCD ? (`${ability?.descr}. Перезарядка - ${ability?.cd} секунд`) : (ability?.descr)}
        </div>
        </motion.div>
    )
}
return(
    <Layout>
        <div className={styles.articleMain}>
            <article className={styles.article}>
                <div className={styles.head}>
                    <h1>{character?.name}</h1>
                    <div className={styles.meta}>
                        <div className={styles.role}>
                            {character?.role}
                        </div>
                        <div className={styles.difficulty}>
                            <PieChart
                                data={[
                                  { title: "Сложность: " + character?.difficulty + "/5", value: character?.difficulty, color: '#C13C37' },
                                  { value: (5 - character?.difficulty), color: '#0' },
                                ]}
                            />
                        </div>
                    </div>
                </div>
                <img alt={character?.name} className={styles.mainImage} src={`/Characters/Big/${character?.image}.png`}/>
                <div className={styles.content}>
                    <div className={styles.contentBody} >
                        <div className={styles.descr}>
                            {character?.descr}
                        </div>
                        <div className={styles.abilities}>
                            <motion.div className={styles.abilityGif} whileHover="hover" animate={tapped && "hover"} onClick={() => setTapped(!tapped)}>
                            <AnimatePresence>
                                <motion.img
                                key={gifID}
                                src={gifs?.[gifID]}
                                alt=""
                                initial={{opacity: 1}}
                                exit={{opacity: 0, zIndex: 5, position: 'absolute'}}
                                transition={{ease: 'easeIn'}}
                                />
                                <AbilityList ability={character?.abilities[gifID]} />
                            </AnimatePresence>
                            </motion.div>
                            <div className={styles.abilityIcons}>
                            {character?.abilities.map((ability, index) => (
                                <div className={styles.abilityIco} key={ability.code}>
                                    <motion.img  alt={ability.code} animate={(gifID === index) ? {scale: 1.3, borderRadius: '25%'} : {scale: 1, borderRadius: '5px'}} src={`/Characters/abilities/${character.image}/${ability.code}.${(character.id === 8 && ability.code === 'W') ? 'gif' : 'png'}`} onClick={() => setGifID(index)}/>
                                </div>
                            ))}
                            </div>
                        </div>
                        <div className={styles.talent}>
                            <b>Особый талант:</b> <br/>
                            {character?.talent}
                        </div>
                    </div>
                </div>
            </article>
            </div>
    </Layout>
)
}

