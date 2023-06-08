/* eslint-disable @next/next/no-img-element */
const TerminusClient = require("@terminusdb/terminusdb-client");
import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true, tables: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window); 
import axios from 'axios';
import 'flowbite';
import { BodyContent } from "../components/_body"
import { SideBar } from "../components/_sidebar"
import { getMenu } from "../utils"

// Connect and configure the TerminusClient
const client = new TerminusClient.WOQLClient('https://cloud.terminusdb.com/TerminatorsX',
	{
		user:"robin@terminusdb.com",
		organization:'TerminatorsX',
		db: "terminusCMS_docs",
		token: process.env.TERMINUSDB_API_TOKEN
	}
)


export default function Home(params: { menu: any[], entry: any[] }) {

  return <>
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
    <SideBar {...params}/>
    <BodyContent entry={params.entry}/>
  </>
}

export async function getStaticProps({ params }) {
   const menu = await getMenu()
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
