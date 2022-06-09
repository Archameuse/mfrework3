import React, { useContext, useState } from "react"

const Context = React.createContext()

export function useMainContext() {
  return useContext(Context)
}
    
export const ContextProvider = ({ children }) => {
  var [lang, setLang] = useState('ru')

    const rawText = {
        ru: {
            layout: {
                nav: [
                    {
                        text: "Логотип",
                        url: "/"
                    },
                    {
                        text: "Турниры",
                        url: "/tournaments"
                    },
                    {
                        text: "Персонажи",
                        url: "/characters"
                    },
                    {
                        text: "Статистика",
                        url: "/statistics"
                    },
                    {
                        text: "Новости",
                        url: "/news"
                    }
                ]
            },
            home: {
              cards: [
                {
                  heading: "Magic Football",
                  text: "Это динамичная карта для Warcraft III, примите на себя роль одного из более чем 30 уникальных персонажей, список которых всё ещё пополняется",
                },
                {
                  heading: "Более трёх уникальных режима",
                  text: "Помимо основного режима 5х5 в карте так же присутствуют"
                },
                {
                  heading: "Следите за картой",
                  text: "Участвуйте в её развитии, а так же различных турнирах и событиях посвящённых ей в Discord, VK и ICCup"
                }
              ]
            },
            news: {
              tags: {
                Changelog: "Изменения",
                News: "Новости",
                Other: "Другое",
              }
            }
        },
        en: {

        }
    }

    var text = rawText.ru
    if(lang === 'en') {text = rawText.en}

    var layoutText = text.layout
    var homeText = text.home
    var newsText = text.news

    return (
        <Context.Provider value={{
          layoutText,
          homeText,
          newsText
        }}>
          {children}
        </Context.Provider>
      )
    }