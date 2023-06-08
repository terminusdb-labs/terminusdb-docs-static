
const TerminusClient = require("@terminusdb/terminusdb-client");
import axios from 'axios';
import { SideBar } from "../components/_sidebar"
import { OnThisPageContent } from "../components/_onThisPage"
import { renderToStaticMarkup } from 'react-dom/server';
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true, tables: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window); 



// Connect and configure the TerminusClient
const client = new TerminusClient.WOQLClient(
	'https://cloud.terminusdb.com/TerminatorsX', {
		user:"robin@terminusdb.com",
		organization:'TerminatorsX',
		db: "CodeDocumentation",
		token: process.env.TERMINUSDB_API_TOKEN
        })

function renderTable(parameters) {
    const rows = parameters.map(param => {
        return <tr>
            <td>{param.name}</td>
            <td>{param.type}</td>
            <td>{param.summary}</td>
            </tr>
    })
    return <table>
        <thead><tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th></tr>
        </thead>
        <tbody>
        {rows}
        </tbody>
    </table>
}

export default function JavaScript( props ) {
 
	const modules = props.application.modules
	const layout = modules.map(mod => {
		const classes = mod.classes.map(class_ => {
		    const functions = class_.memberFunctions.map(func => {
                        let args = null
                        let shortArgs = null
                        if (typeof func.parameters !== 'undefined') {
                            args = renderTable(func.parameters)
                            shortArgs = func.parameters.map(x => x.name).join(",")
                        }
                        return <div key={func.name}><h4 id={func.name}>{func.name}({shortArgs})</h4><div data-accordion="collapse">{args}<p>{func.summary}</p></div></div>
                        })
			return (<div key={class_.name}><h3 id={class_.name}>{class_.name}</h3>{functions}</div>)
		})
		return (<div key={mod.name}><h2 id={mod.name}>{ mod.name }</h2>{ classes }</div>)
	})
	const html = renderToStaticMarkup(layout);
	const cleanedHtml = DOMPurify.sanitize(html);

	return <>
		<SideBar {...props}/>
		<div className="flex p-4 sm:ml-96 p-4 sm:ml-96 h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 fixed">
    	<div className="pl-20 rounded-lg font-normal container sm">
				<h1>{ props.application.name }</h1>
				{ layout }
				<OnThisPageContent html={cleanedHtml}/>
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

    const application = await axios.post('https://cloud.terminusdb.com/TerminatorsX/api/graphql/TerminatorsX/CodeDocumentation', {
        query: `query {
            Application(filter: {language: {eq: Javascript} } ) {
                name,
                modules {
                   name,
                   classes {
                      name,
                      memberFunctions(orderBy: {name: ASC}) {
                          name,
                          section,
                          summary,
                           parameters {
                           default
                           summary
                           name
                           type 
                         }
                      }
                   }
                }
            }
       }`
    }, config)
    
    return { props: { application: application.data.data.Application[0], menu } }
}
