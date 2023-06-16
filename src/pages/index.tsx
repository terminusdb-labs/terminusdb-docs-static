/* eslint-disable @next/next/no-img-element */
const TerminusClient = require("@terminusdb/terminusdb-client");
import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true, tables: true})
import axios from 'axios';
import 'flowbite';
import { getHtml, getSubTitle } from "../utils"
import menu from "../menu.json"
import { Layout } from "../components/_layout"
import { useRouter } from 'next/router'
const probe = require('probe-image-size');
 

export default function Home(props: { menu: any[], entry: any[] }) {
    let html = getHtml(props.entry)
    const router = useRouter()
    if (router.basePath != '') {
      html = html.replaceAll(/<a href="\/([a-z-]*)">/g, `<a href="${router.basePath}/$1/">`)
    }
    let displayElement = <div dangerouslySetInnerHTML={{__html: html}}/>
    return <Layout menu={props.menu} 
        entry={props.entry}
        displayElement={displayElement} 
        heading={props.entry.document.title.value}
        subtitle={getSubTitle(props.entry.document)}
        seo_metadata={props.entry.document.seo_metadata}
     />
}

export async function getStaticProps({ params }) {
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
    let html = converter.makeHtml(docResult['body']['value'])
        const imgTags = html.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
        if (imgTags !== null) {
            for (let img of imgTags) {
                if (img.includes('width="')) {
                    // Skip images that already have their width/height set
                    continue
                }
                const src = img.replace(/.*src="([^"]*)".*/, '$1')
                let result = await probe(src);
                const newImage = img.replace('<img', `<img width="${result.width}" height="${result.height}"`)
                html = html.replace(img, newImage)
            }
        }
  const entry = {html: html, document: docResult }
  return { props: { menu: menu, entry: entry } }
}
