import Layout from '../../components/layout'
import { useState, useRef, useEffect } from 'react';
import axios from 'axios'
import { useQuery, useQueryClient } from "react-query";
import styles from '../../styles/News.module.css'
import { useRouter } from 'next/router';
import { useMainContext } from '../../contexts/maincontext';





export default function Article() {
const queryClient = useQueryClient();
const router = useRouter()
const id = router.query.id
const { newsText } = useMainContext()

const getArticle = () => {
    return axios.get('/api/sheetArticle', {params: {id}}).then(res => res.data)
  }

const { data: Article, error } = useQuery(
    ["Article", id], getArticle,
    {
        refetchOnWindowFocus: false
    }
  );

const date = new Date(Article?.date)
console.log(Article?.date)
    return(
        <Layout>
            
            <div className={styles.articleMain}>
            <article className={styles.article}>
                <div className={styles.head}>
                    <div className={styles.top}>
                        <div className={`${styles.tag} ${styles.left}`}>
                            <a>{newsText.tags[Article?.tags]}</a>
                        </div>
                        <div className={`${styles.time} ${styles.left}`}>
                            { date && (<time dateTime={Article?.date}>{`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}</time>)}
                        </div>
                        <div className={`${styles.author} ${styles.left}`}>
                            <a>{Article?.author}</a>
                        </div>
                    </div>
                    <h1>{Article?.heading}</h1>
                </div>
                <img className={styles.mainImage} src={Article?.image} alt='main image'/>
                <div className={styles.content}>
                    <div className={styles.contentBody} dangerouslySetInnerHTML={{ __html: Article?.body }}/>
                </div>
                
            </article>
            </div>
            
        </Layout>
    )
}