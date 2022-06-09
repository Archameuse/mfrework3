import Layout from "../../components/layout";
import styles from "../../styles/News.module.css"
import { useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from 'react'
import { Pagination } from '@mantine/core'
import { useRouter } from "next/router";
import axios from 'axios'
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { motion, animate } from 'framer-motion'
import Link from "next/link";
import { useMainContext } from "../../contexts/maincontext";

export default function News() {
const queryClient = useQueryClient();
const router = useRouter()
const [page, setPage] = useState(1)
const limit = 10
const isPhone = useMediaQuery('(max-width: 768px)')
const { newsText } = useMainContext()
var [tag, setTag] = useState(false)
var amountPages = 1

const getNews = () => {
  return axios.get('/api/sheet')
    .then(res => res.data.reverse().filter((e) => (e.tag === tag || !tag)))
 }

const getPage = () => {
  return TotalNews?.slice((limit*(page-1)), (limit*page))
}

let { data: TotalNews, refetch } = useQuery(
  ["TotalNews", tag], getNews,
    {
        keepPreviousData: true,
        refetchOnWindowFocus: false
    }
);

let { status, error, data: News } = useQuery(
  ["News", page], getPage,
    {
        enabled: !!TotalNews,
        keepPreviousData: true
    }
);

if(TotalNews?.length) amountPages = Math.ceil(TotalNews?.length / limit)


useEffect(() => {  
    if (!router.query.page) return
    if (router.query.page < 1) {
      router.push(`?page=1`)
    }
    if (router.query.page > amountPages && amountPages !== 1) {
      router.push(`?page=${amountPages}`)
    }
    setPage(parseInt(router.query.page));
    
  }, [router.query.page]);

  function handlePagination(e) {
    setPage(e)
    router.push(`?page=${e}`)
  }

  const pseudoPC = {
    initial : {borderRadius: "50%" ,width: "0%", height: "0%", top: "50%", left: "50%"},
    hover: {borderRadius: 0, width: "100%", height: "100%", top: "0%", left: "0%"}
  }

  const pseudoPhone = {
    hover: {scale: 1.2},
    tap: {scale: 1.2}
  }

return(
    <Layout>
        <main className={styles.main}>
            <div className={styles.grid_wrap}>
                {News?.map((item) => {
                  let date = new Date(item.date)
                  let tag = () => {
                    return newsText.tags[item.tags]
                  }
                  return (
                    <Link href={`/news/${item.id}`} key={item.id}>
                    <motion.div className={styles.card} initial="initial" whileHover="hover" whileTap="tap" >
                      {!isPhone && (<div className={styles.cardLeft} style={{backgroundImage: `url(${item.image})`, backgroundSize: 'cover'}}>
                        <div className={styles.image}>
                          <div className={styles.tags}><p>{tag()}</p></div>
                        </div>
                      </div>)}
                      <div className={!isPhone ? styles.cardRight : `${styles.cardRight} ${styles.cardPhone}`}>
                        {isPhone ? (
                          <motion.div className={styles.pseudoPhone} variants={pseudoPhone} style={{backgroundImage: `url(${item.image})`, backgroundSize: 'cover'}}/>) : (
                          <motion.div className={styles.pseudoPC} variants={pseudoPC} transition={{type: 'just'}}/>
                        )}
                        <div className={styles.top}>
                          <div className={styles.date}><p>{`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}</p></div>
                          <div className={styles.author}><p>{item.author}</p></div>
                        </div>
                        <div className={styles.bottom}>
                          <div className={styles.heading}><h1>{item.heading}</h1></div> 
                          <div className={styles.text}><p>{item.descr}</p></div>
                        </div>
                      </div>
                    </motion.div></Link>
                )})}
            </div>
            <div className={styles.paginationWrap}>
              <Pagination 
                total={amountPages}
                page={page}
                onChange={handlePagination}
              />
            </div>
            
        </main>
    </Layout>
)
}


