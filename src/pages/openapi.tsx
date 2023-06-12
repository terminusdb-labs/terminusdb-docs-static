
const TerminusClient = require("@terminusdb/terminusdb-client");
import axios from 'axios';
import { OnThisPageContent } from "../components/_onThisPage"
import { renderToStaticMarkup } from 'react-dom/server';
import { getMenu } from "../utils"
const fs = require('fs');
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { Layout } from "../components/_layout"

// Connect and configure the TerminusClient
const client = new TerminusClient.WOQLClient('https://cloud-dev.terminusdb.com/TerminatorsX',
                                             {user:"robin@terminusdb.com",
                                              organization:'TerminatorsX',
                                              db: "CodeDocumentation",
                                              token: process.env.TERMINUSDB_API_TOKEN})


//        <div dangerouslySetInnerHTML={{__html: props.html }}/>
export default function Home( props ) {
		const layout =  <>
        <SwaggerUI url="https://raw.githubusercontent.com/terminusdb/terminusdb/main/docs/openapi.yaml" />
	</>
	const html = renderToStaticMarkup(layout);
    return <Layout menu={props.menu}
		displayElement={layout}
		html={html}
		entry={props.entry}
		heading="OpenAPI spec"/>
}


export async function getStaticProps(context) {
    const menu = await getMenu()
	// provide entry slug
    const entry = {document: { slug: `openapi` }}
    return { props: { html: {}, menu, entry } }
}
