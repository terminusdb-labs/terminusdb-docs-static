
import axios from 'axios';
import { renderToStaticMarkup } from 'react-dom/server';
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true, tables: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
import { getMenu, renderCodeTable, formatAnchorIds, formatShortHandAnchorIds } from "../utils"
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window); 
import { Layout } from "../components/_layout"


export default function JavaScript( props ) {
	const modules = props.application.modules
	const layout = modules.map(mod => {
		const classes = mod.classes.map(class_ => {
<<<<<<< HEAD
		  const functions = class_.memberFunctions.map(func => {
				let args = null
				let shortArgs = null
				if (typeof func.parameters !== 'undefined' && func.parameters.length > 0) {
					args = renderCodeTable(func.parameters)
					shortArgs = func.parameters.map(x => x.name).join(", ")
				}
				return <div key={func.name}>
					<h4 id={formatAnchorIds(formatShortHandAnchorIds(func.name, shortArgs))}>
						{func.name}({shortArgs})
					</h4>
					<div data-accordion="collapse">{args}<p>{func.summary}</p></div></div>
			})
			return (<div key={class_.name}>
				<h3 id={formatAnchorIds(class_.name)}>{class_.name}</h3>
				{functions}
			</div>)
=======
		    const functions = class_.memberFunctions.map(func => {
                        let args = null
                        let shortArgs = null
                        if (typeof func.parameters !== 'undefined' && func.parameters.length > 0) {
                            args = renderCodeTable(func.parameters)
                            shortArgs = func.parameters.map(x => x.name).join(", ")
                        }
                        return <div key={func.name}><h4 id={func.name}>{func.name}({shortArgs})</h4><p>{func.summary}</p><div data-accordion="collapse">{args}</div></div>
                        })
			return (<div key={class_.name}><h3 id={class_.name}>{class_.name}</h3>{functions}</div>)
>>>>>>> e891aa9d724e646c18c45cecc58c5925ba44fe02
		})
		return (<div key={mod.name}>
			<h2 id={formatAnchorIds(mod.name)}>{ mod.name }</h2>
			{ classes }
		</div>)
	})
	const html = renderToStaticMarkup(layout);
	const cleanedHtml = DOMPurify.sanitize(html);
	
  return <Layout menu={props.menu} 
		displayElement={layout} 
		html={cleanedHtml}
		entry={props.entry}
		heading={props.application.name}/>


}


export async function getStaticProps(context) {
	const config = {
			headers: { Authorization: `Token ${process.env.TERMINUSDB_API_TOKEN}` }
	};
	const menu = await getMenu()

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
	// provide entry slug
	const entry = {document: { slug: `javascript` }}

	return { props: { application: application.data.data.Application.slice(-1)[0], menu, entry } }
}
