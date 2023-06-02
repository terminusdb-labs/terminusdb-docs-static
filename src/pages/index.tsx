/* eslint-disable @next/next/no-img-element */
const TerminusClient = require("@terminusdb/terminusdb-client");
import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window); 
import axios from 'axios';
import 'flowbite';
import renderMainMenu  from "./_menu"
import { BodyContent } from "./_body"

// Connect and configure the TerminusClient
const client = new TerminusClient.WOQLClient('https://cloud-dev.terminusdb.com/TerminatorsX',
	{
		user:"robin@terminusdb.com",
		organization:'TerminatorsX',
		db: "terminusCMS_docs",
		token: process.env.TERMINUSDB_API_TOKEN
	}
)


export default function Home(params: { menu: any[], entry: any[] }) {

  return <>
    <aside id="sidebar-multi-level-sidebar" 
      className="fixed top-0 left-0 z-40 w-96 h-screen transition-transform -translate-x-full sm:translate-x-0" 
      aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <a href="https://terminusdb.com/" className="flex items-center pl-2.5 mb-5">
          <img src="https://4053281810-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FVZc9T1wJdVvodyIFrJuV%2Flogo%2F5UCCcn4lbzsXbvjpObGc%2FTerminusDB-Logo.svg?alt=media&amp;token=b0b8f1f0-d830-46de-a805-69bdda20bbe0" 
            className="h-12" 
            width="100%" height="auto" decoding="async"
            alt="TerminusDB Logo" />
        </a>
        <div className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700"/>
        <ul className="space-y-2 font-medium">
          { renderMainMenu(params.menu, params.entry) }
        </ul>
      </div>
    </aside>
    <BodyContent entry={params.entry}/>
  </>
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
  const menu = req.data.data.Menu

  const query = {
    "@type": "Page",
    "slug": "get-started"
  }
  const docs = await client.getDocument({ "@type": "Page", as_list: true, query: query })
  const docResult = docs[0]
  const html = converter.makeHtml(docResult['body']['value'])
  const cleanedHtml = DOMPurify.sanitize(html)
  const entry = {html: cleanedHtml, document: docResult }

  return { props: { menu: menu, entry: entry } } 
}
