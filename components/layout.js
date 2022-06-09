import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion, animate, AnimatePresence } from 'framer-motion'
import styles from '../styles/Layout.module.css'
import { useMainContext } from '../contexts/maincontext'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useState } from 'react'
import LoginMenu from '../components/loginmenu'




export default function Layout({children}) {
const { layoutText } = useMainContext()
const isSmall = useMediaQuery('(max-width: 850px)')
return(
<>
    <Head>
        <title>Magic Football</title>
        <meta charSet="utf-8"/>
        <link rel="icon" href="/mfico.png"/>
    </Head>
    <header className={styles.header}>
        {!isSmall ? (<Fullmenu text={layoutText.nav}/>)
                 : (<Expandmenu text={layoutText.nav}/>)}
    </header>   
    {children}
    <LoginMenu/>
</>
)
}

function Fullmenu({text}) {
    return(
    <nav className={styles.nav}>
    <ul className={styles.ul}>
    <div className={styles.logo}>
    <Link href={text[0].url}>
        <motion.li 
        drag 
        dragConstraints={{left: 0, right: 0, top: 0, bottom: 0}} 
        style={{cursor: "pointer"}}>
            <Image src='/mflogo.png' width={225} height={40} alt='mf logo'/>
        </motion.li>
        </Link>
    </div>
    <div className={styles.container}>
    {text.slice(1).map((item) => (
        <motion.li
            key={item.text}
            whileHover={{scale: 1.03}}
            whileTap={{scale: 1}}
        ><Link href={item.url}>{item.text}</Link>
        </motion.li>
    ))}
    </div>
    </ul>
    </nav>
    )
}

function Expandmenu({text}) {
    const [expanded, setExpanded] = useState(false)
    return(
        <>
        <nav className={styles.nav}>
        <ul className={styles.ul}>
        <div className={styles.logo}>
        <Link href={text[0].url}>
            <motion.li 
            drag 
            dragConstraints={{left: 0, right: 0, top: 0, bottom: 0}} 
            style={{cursor: "pointer"}}>
                
                    <Image src='/mflogo.png' width={225} height={40} alt='mf logo'/>
                    
            </motion.li>
            </Link>
        </div>
        <div className={styles.container}>
            <div className={styles.expandbutton}>
                <motion.svg initial={{scale: 1.67, rotate: 90}} animate={expanded ? {rotate: 270} : {rotate: 90}} style={{cursor: "pointer"}} onClick={() => setExpanded(!expanded)} width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 12l-20 12 7.289-12-7.289-12z"/></motion.svg>
            </div>
        </div>
        </ul>
        
        </nav>
        <AnimatePresence>
        {expanded && (
        <motion.ul className={styles.expandNav} initial={{height: 0}} exit={{height: 0}} animate={{height: 'fit-content'}} >
                {text.slice(1).map((item) => (
                    <Link href={item.url} key={item.url}><motion.li whileTap={{scale: 1.05, boxShadow: '0 0 5px 1px black'}}>{item.text}</motion.li></Link>
                ))}
        </motion.ul>)}
        </AnimatePresence>
        </>
        )
}