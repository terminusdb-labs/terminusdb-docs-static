const TerminusClient = require("@terminusdb/terminusdb-client");
import axios from 'axios';
import { SideBar } from "../components/_sidebar"

// Connect and configure the TerminusClient
const client = new TerminusClient.WOQLClient('https://cloud-dev.terminusdb.com/TerminatorsX',
                                             {user:"robin@terminusdb.com",
                                              organization:'TerminatorsX',
                                              db: "CodeDocumentation",
                                              token: process.env.TERMINUSDB_API_TOKEN})

export default function Python( props ) {
    const modules = props.application.modules
    const layout = modules.map(mod => {
        const classes = mod.classes.map(class_ => {
            const functions = class_.memberFunctions.map(func =>
                <div key={func.name}><h4>{func.name}</h4><p>{func.summary}</p></div>
            )
            return (<div key={class_.name}><h3>{class_.name}</h3>{functions}</div>)
        })
        return (<div key={mod.name}><h2>{ mod.name }</h2>{ classes }</div>)
    })

		return  <>
			<SideBar {...props}/>
			<div className="flex p-4 sm:ml-96 p-4 sm:ml-96 h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
				<div className="pl-20 rounded-lg font-normal">
					<h1>{ props.application.name }</h1>
					{ layout }
				</div>
			</div>
		</>
  
}


export async function getStaticProps(context) {
    const config = {
        headers: { Authorization: `Token ${process.env.TERMINUSDB_API_TOKEN}` }
    };

    const req = await axios.post('https://cloud-dev.terminusdb.com/TerminatorsX/api/graphql/TerminatorsX/terminusCMS_docs', {
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

    const application = await axios.post('https://cloud-dev.terminusdb.com/TerminatorsX/api/graphql/TerminatorsX/CodeDocumentation', {
        query: `query {
            Application(filter: {language: {eq: Python} } ) {
                name,
                modules {
                   name,
                   classes {
                      name,
                      memberFunctions {
                          name,
                          summary
                      }
                   }
                }
            }
       }`
    }, config)
    return { props: { application: application.data.data.Application[0], menu } }
}
