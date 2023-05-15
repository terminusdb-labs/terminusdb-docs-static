import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import axios from 'axios';

function renderMenu(menu) {
    const menuItems = menu.Level1.map(level1 => {
        const level2Items = level1.Level2.map(level2 => {
            if (typeof level2 === 'undefined') {
              return ''
            }
            const level3Items = level2.Level3.map(level3 => {
                return <li key={level3.Menu3Page.slug}><a href={level3.Menu3Page.slug}>{level3.Menu1Label}</a></li>
            })
            return <li key={level2.Menu2Page.slug}><a href={level2.Menu2Page.slug}>{level2.Menu2Label}</a><ul>{ level3Items }</ul></li>
        })
        return <li key={level1.Menu1Page.slug}><a href={level1.Menu1Page.slug}>{level1.Menu1Label}</a><ul>{ level2Items }</ul></li>
    })
    return menuItems
}

export default function Home(params) {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="menu">
          <ul>
          { renderMenu(params.menu) }
          </ul>
          </div>
    </main>
  )
}

export async function getStaticProps({ params }) {
    const config = {
        headers: { Authorization: `Token ${process.env.TERMINUSDB_API_TOKEN}` }
    };
    const req = await axios.post('https://cloud-dev.terminusdb.com/TerminatorsX/api/graphql/TerminatorsX/terminusCMS_docs', {
        query: `query {
  Menu {
    MenuTitle
    Level1 {
      Menu1Label,
      Menu1Page {
        slug
      },
      Level2 {
        Menu2Label,
        Menu2Page{
          slug
        },
        Level3 {
          Menu3Label,
          Menu3Page {
            slug
          }
        }
      }
    }
  }
}`
    }, config)
    const menu = req.data.data.Menu[0]
    return { props: { menu: menu } }
}
