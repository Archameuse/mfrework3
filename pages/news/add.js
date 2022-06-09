import { useRef, useState } from 'react';
import Layout from '../../components/layout';
import axios from 'axios'
import styles from '../../styles/News.module.css'
import dynamic from "next/dynamic";
import options from '../../public/JSON/sunOptions.json'
import 'suneditor/dist/css/suneditor.min.css';
import PreviewModal from '../../components/preview';
import { useSession } from 'next-auth/react';
import { admins } from '../../public/admins';

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export default function Add() {
    const { data: session } = useSession()
    const user = session?.user

    //preview
    const descrRef = useRef()
    const headingRef = useRef()
    const imageRef = useRef()
    const newDate = new Date()

    const author = user?.name
    const date = newDate.getDate()
    const [tag, setTag] = useState()
    const [body, setBody] = useState()
    const [previewText, setPreviewText] = useState()
    const [previewShow, setPreviewShow] = useState(false)

    const addArticle = (article) => {
        return axios.post('/api/sheet', {article})
    }


    function ifEmpty(){
        if(!tag) {alert('Fill tags'); return true}
        if(!headingRef.current.value) {alert('Fill heading'); return true}
        if(!body) {alert('Fill body'); return true}
        if(!imageRef.current.value) {alert('Fill image url'); return true}

    }

    function handleSubmit(e) {
        e.preventDefault();
        if(ifEmpty()) return false
        let article = [
            {"values": newDate},                      //   Date      
            {"values": author},                     //   Author
            {"values": tag},                          //   Tag   
            {"values": headingRef.current.value},  //   Heading  
            {"values": body},                         //   Body
            {"values": descrRef.current.value},      //   Descr
            {"values": imageRef.current.value},      //   Image
        ]
        try {
            addArticle(article)
        } catch(e) {
            console.log(e)
            alert('Check console for error')
        }
    }

    function handlePreview(e) {
        e.preventDefault()
        let article = {
            date: newDate,
            author: author,
            tags: tag,
            heading: headingRef.current.value,
            body: body,
            descr: descrRef.current.value,
            image: imageRef.current.value,
        }
        setPreviewText(article)
        setPreviewShow(true)
    }

if (admins.includes(user?.email) && session)    return(
        <Layout>
            <main className={styles.addMain}>
            <form className={styles.addForm} onSubmit={(e) => handleSubmit(e)}>
                <div className={styles.heading}>
                    <label >Heading</label>
                    <input ref={headingRef} type="text" name="title" maxLength="35"/>
                </div>
                <div className={styles.image}>
                    <label >Image URL</label>
                    <input ref={imageRef} type="url" name="image"/>
                </div>
                <div className={styles.descr}>
                    <label >Description</label>
                    <textarea ref={descrRef} tabIndex="2" name="descr" id="descr" />
                </div>
                <div className={styles.tags}>
                    <div className={styles.tag} >
                        <label >News</label>
                        <input type="radio" name="tags" value="News" onClick={(e) => setTag(e.target.value)}/>
                    </div>
                    <div className={styles.tag}>
                        <label >Changelog</label>
                        <input type="radio" name="tags" value="Changelog" onClick={(e) => (setTag(e.target.value))}/>
                    </div>
                    <div className={styles.tag}>
                        <label >Other</label>
                        <input type="radio" name="tags" value="Other" onClick={(e) => setTag(e.target.value)}/>
                    </div>
                </div>
                <div className={styles.suneditor}>
                    <SunEditor setOptions={options} onChange={(e) => (setBody(e))}/>
                </div>
                <div className={styles.buttons}>
                    <input type="submit" value="Submit"/>
                    <button onClick={(e) => handlePreview(e)}>Preview</button>
                </div>
            </form>
            </main>
            {previewShow && (<PreviewModal text={previewText} onClose={() => setPreviewShow(false)}/>)}
        </Layout>
    )
    else return (
        <Layout>
          <h1 style={{textAlign: 'center'}}>You have no permission to view this page</h1>
        </Layout>
    )
}