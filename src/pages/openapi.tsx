
const TerminusClient = require("@terminusdb/terminusdb-client");
import axios from 'axios';
import { SideBar } from "../components/_sidebar"
import { OnThisPageContent } from "../components/_onThisPage"
import { renderToStaticMarkup } from 'react-dom/server';
const fs = require('fs');
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

// Connect and configure the TerminusClient
const client = new TerminusClient.WOQLClient('https://cloud-dev.terminusdb.com/TerminatorsX',
                                             {user:"robin@terminusdb.com",
                                              organization:'TerminatorsX',
                                              db: "CodeDocumentation",
                                              token: process.env.TERMINUSDB_API_TOKEN})


//        <div dangerouslySetInnerHTML={{__html: props.html }}/>
export default function Home( props ) {
		return  <>
	<SideBar {...props}/>
        <div className="flex sm:ml-96 p-8 sm:ml-96 h-full px-3 bg-gray-50 dark:bg-gray-800 container border-x-2">
	<div className="pl-20 rounded-lg font-normal">
        <SwaggerUI url="https://raw.githubusercontent.com/terminusdb/terminusdb/main/docs/openapi.yaml" />
	</div>
			</div>
		</>
  
}


export async function getStaticProps(context) {
    const config = {
        headers: { Authorization: `Token ${process.env.TERMINUSDB_API_TOKEN}` }
    };

    const req = await axios.post('https://cloud.terminusdb.com/TerminatorsX/api/graphql/TerminatorsX/terminusCMS_docs', {
				query: `query {
					Menu {
						MenuTitle
						Level1 {
							Menu1Label,
							Order,
							Menu1Page {
								slug
							},
							Level2 {
								Menu2Label,
								Order,
								Menu2Page{
									slug
								},
								Level3 {
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
    return { props: { html: {}, menu } }
}
