
import { OnThisPageContent } from "../components/_onThisPage"
import { renderToStaticMarkup } from 'react-dom/server';
import { getMenu } from "../utils"
const fs = require('fs');
import dynamic from "next/dynamic";
const SwaggerUI = dynamic(import('swagger-ui-react'), {ssr: false})
import "swagger-ui-react/swagger-ui.css"
import { Layout } from "../components/_layout"

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
