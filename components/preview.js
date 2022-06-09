import { useMainContext } from '../contexts/maincontext'
import styles from '../styles/News.module.css'

export default function PreviewModal({text, onClose}) {
    const { newsText } = useMainContext()
    function handleModalClick(e) {
        e.preventDefault()
        e.stopPropagation()
    }
    return(
        <div className={styles.modalMain} onClick={onClose}>
            <div className={styles.modalBody} onClick={(e) => handleModalClick(e)}>
                <article className={styles.article}>
                    <div className={styles.head}>
                        <div className={styles.top}>
                            <div className={`${styles.tag} ${styles.left}`}>
                                <a>{newsText.tags[text.tags]}</a>
                            </div>
                            <div className={`${styles.time} ${styles.left}`}>
                                <time dateTime='2022-05-31T15:34:57+03:00'>сегодня тамхз</time>
                            </div>
                            <div className={`${styles.author} ${styles.left}`}>
                                <a>{text.author}</a>
                            </div>
                            <div onClick={onClose} className={`${styles.close} ${styles.right}`}>
                                <a>X</a>
                            </div>
                        </div>
                        <h1>{text.heading}</h1>
                    </div>
                    <img className={styles.mainImage} src={text.image} alt='main image'/>
                    <div className={styles.content}>
                        <div className={styles.contentBody} dangerouslySetInnerHTML={{ __html: text.body }}/>
                    </div>
                </article>
            </div>
        </div>
    )
}