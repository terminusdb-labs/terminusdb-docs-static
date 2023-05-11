import Image from 'next/image'
import { Inter } from 'next/font/google'
const TerminusClient = require("@terminusdb/terminusdb-client");
const inter = Inter({ subsets: ['latin'] })

function renderMenuItems(menuItems) {
    console.log(menuItems)
    return menuItems.map(x => {
        let url = x.page[0].split("/")[1]
        return (
        <li><a href={url}>{x.label}</a></li>)
    })
}

export default function Home(params) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <ul>
          { renderMenuItems(params.menuItems) }
          </ul>
    </main>
  )
}

export async function getStaticProps({ params }) {
const client = new TerminusClient.WOQLClient('https://cloud-dev.terminusdb.com/TerminatorsX',
                                             {user:"robin@terminusdb.com",
                                              organization:'TerminatorsX',
                                              db: "terminusCMS_docs",
                                              token: process.env.TERMINUSDB_API_TOKEN})
    const query = {
        "@type": "MenuItem"
    }
    const docs = await client.getDocument({"@type": "MenuItem", as_list: true, query: query})
    return { props: { menuItems: docs } }
}
