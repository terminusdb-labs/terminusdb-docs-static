/* eslint-disable @next/next/no-img-element */
const TerminusClient = require("@terminusdb/terminusdb-client");
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true, tables: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);  
import axios from 'axios';
import Seo from "../components/seo"
import { Layout } from "../components/_layout"
import { getHtml, getMenu, getSubTitle } from "../utils"
import Link from 'next/link'

// Connect and configure the TerminusClient
const client = new TerminusClient.WOQLClient('https://cloud.terminusdb.com/TerminatorsX', {
		user:"robin@terminusdb.com",
		organization:'TerminatorsX',
		db: "terminusCMS_docs",
		token: process.env.TERMINUSDB_API_TOKEN
})

function getChildren(document, menu, level) {
    const menuPageSlug = menu[`Menu${level}Page`]['slug']
    if (document.slug === menuPageSlug) {
        const deeperLevel = level + 1
        const children = menu[`Level${deeperLevel}`].map(child => {
            return {'slug': child[`Menu${deeperLevel}Page`]['slug'],
                    'label': child[`Menu${deeperLevel}Label`]}
        })
        return children
    }
    return []
}

function defaultDoc(document, menus) {
    const children = []
    menus.forEach(menu => {
        menu.Level1.forEach(menu1 => {
            children.push(...getChildren(document, menu1, 1))
            menu1.Level2.forEach(menu2 => {
                children.push(...getChildren(document, menu2, 2))
            })
        })
    })
    const links = children.map(child => {
        return <Link key={child.slug} href={'/' + child.slug} className="block p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            { child.label }
        </Link>
    })
    return <>
        {links}
        </>
}

export default function Doc( props: JSX.IntrinsicAttributes & { menu: any[]; entry: any[]; } ) {

  let html = getHtml(props.entry)
  if (process.env.BASE_PATH) {
      html = html.replaceAll(`<a href="/`, `<a href="${process.env.BASE_PATH}/`)
  }
    let displayElement = <div dangerouslySetInnerHTML={{__html: html}}/>
    //return <BlankPage/>
        if (typeof props.entry.document.body === 'undefined') {
            displayElement = defaultDoc(props.entry.document, props.menu)
    }
  return <Layout menu={props.menu} 
    entry={props.entry}
    displayElement={displayElement} 
    html={html}
    heading={props.entry.document.title.value}
    subtitle={getSubTitle(props.entry.document)}
    seo_metadata={props.entry.document.seo_metadata}/>
}



export async function getStaticPaths() {
    const docs = await client.getDocument({"@type": "Page", as_list: true})
    const exceptions = ['python', 'openapi', 'javascript']
    const paths = docs.filter(x => {
        return typeof x['slug'] !== 'undefined' && !exceptions.includes(x['slug'])
    }).map(x => "/" + x["slug"])
    return { paths: paths, fallback: false }
}


export async function getStaticProps({ params }) {

	const config = {
		headers: { Authorization: `Token ${process.env.TERMINUSDB_API_TOKEN}` }
	};
        const menu = await getMenu()

	const query = {
			"@type": "Page",
			"slug": params['name']
	}
	const docs = await client.getDocument({ "@type": "Page", as_list: true, query: query })
        const docResult = docs[0]
        let html = ''
        if (typeof docResult['body'] !== 'undefined') {
            html = converter.makeHtml(docResult['body']['value'])
        }
	const cleanedHtml = DOMPurify.sanitize(html)
	const entry = {html: cleanedHtml, document: docResult }
	return { props: { entry, menu } } 
}
