import Layout from "../../components/layout";
import characters from "../../public/JSON/characters.json"
import styles from "../../styles/Characters.module.css"
import Link from "next/link";
import { animate, motion } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { Tooltip } from "@mantine/core";



export default function Characters() {
    const isPhone = useMediaQuery('(max-width: 768px)')
return (
<Layout>
<main className={styles.center}>
    <div className={isPhone ? `${styles.tavern} ${styles.tavernPhone}` : `${styles.tavern}`}>
        {characters.characters.map((item) => {
        return(
        <Link key={item.id} href={`/characters/${item.id}`}>
                <Tooltip color="dark" withArrow label={`Сложность: ${item.difficulty}`}>
                <motion.img whileHover={{scale: 1.05}} whileTap={{scale:0.95}} src={`/Characters/${item.image}.png`} alt={item.image}/>
                </Tooltip>
        </Link>
        )})}
    </div>
</main>
</Layout>
)
}