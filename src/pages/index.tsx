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
import { getHtml, getSubTitle, getMenu } from "../utils"
import { Layout } from "../components/_layout"
import { useRouter } from 'next/router'

 

export default function Home(props: { menu: any[], entry: any[] }) {
    let html = getHtml(props.entry)
    const router = useRouter()
    if (router.basePath != '') {
      html = html.replaceAll(`<a href="/`, `<a href="${router.basePath}/`)
    }
    let displayElement = <div dangerouslySetInnerHTML={{__html: html}}/>
    return <Layout menu={props.menu} 
        entry={props.entry}
        displayElement={displayElement} 
        html={html}
        heading={props.entry.document.title.value}
        subtitle={getSubTitle(props.entry.document)}
        seo_metadata={props.entry.document.seo_metadata}
     />
}

export async function getStaticProps({ params }) {
   const menu = await getMenu()
// Connect and configure the TerminusClient
    const client = new TerminusClient.WOQLClient('https://cloud.terminusdb.com/TerminatorsX',
                                                 {
        user:"robin@terminusdb.com",
        organization:'TerminatorsX',
        db: "terminusCMS_docs",
        token: process.env.TERMINUSDB_API_TOKEN
    }
                                                )
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
