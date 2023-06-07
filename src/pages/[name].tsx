/* eslint-disable @next/next/no-img-element */
const TerminusClient = require("@terminusdb/terminusdb-client");
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true, tables: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);  
import axios from 'axios';
import { BodyContent } from "../components/_body"
import { SideBar } from "../components/_sidebar"

// Connect and configure the TerminusClient
const client = new TerminusClient.WOQLClient('https://cloud-dev.terminusdb.com/TerminatorsX',
	{
		user:"robin@terminusdb.com",
		organization:'TerminatorsX',
		db: "terminusCMS_docs",
		token: process.env.TERMINUSDB_API_TOKEN
	}
)

export default function Doc( props: JSX.IntrinsicAttributes & { menu: any[]; entry: any[]; } ) {
	return <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
    <button data-drawer-target="sidebar-multi-level-sidebar" 
      data-drawer-toggle="sidebar-multi-level-sidebar" 
      aria-controls="sidebar-multi-level-sidebar" 
      type="button" 
      className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
      <span className="sr-only">Open sidebar</span>
      <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
      </svg>
    </button>
		<SideBar {...props}/>
		<BodyContent entry={props.entry}/>
	</div>
}



export async function getStaticPaths() {
	const docs = await client.getDocument({"@type": "Page", as_list: true})
	const paths = docs.filter(x => typeof x['slug'] !== 'undefined' && typeof x['body'] !== 'undefined').map(x => "/" + x["slug"])
	return { paths: paths, fallback: false }
}

    

export async function getStaticProps({ params }) {

	const config = {
		headers: { Authorization: `Token ${process.env.TERMINUSDB_API_TOKEN}` }
	};

	const req = await axios.post('https://cloud-dev.terminusdb.com/TerminatorsX/api/graphql/TerminatorsX/terminusCMS_docs', {
			query: `query {
        Menu(orderBy: {menu_order:ASC}) {
          MenuTitle,
          menu_order,
          Level1(orderBy: {Order:ASC})  {
            Menu1Label,
            Order,
            Menu1Page {
              slug
            },
            Level2(orderBy: {Order:ASC}) {
              Menu2Label,
              Order,
              Menu2Page{
                slug
              },
              Level3(orderBy: {Order:ASC}) {
                Menu3Label,
                Order,
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
			"slug": params['name']
	}
	const docs = await client.getDocument({ "@type": "Page", as_list: true, query: query })
	const docResult = docs[0]
	const html = converter.makeHtml(docResult['body']['value'])
	const cleanedHtml = DOMPurify.sanitize(html)
	const entry = {html: cleanedHtml, document: docResult }
	return { props: { entry, menu } }
}
