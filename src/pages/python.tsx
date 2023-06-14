
import axios from 'axios';
import { renderToStaticMarkup } from 'react-dom/server';
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true, tables: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
import { renderCodeTable, renderExamples, formatShortHandAnchorIds, formatAnchorIds } from "../utils"
import menu from "../menu.json"
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
import { Layout } from "../components/_layout"


export default function Python( props ) {
	const modules = props.application.modules
	const layout = modules.map(mod => {
	            const classes = mod.classes.filter(x => x.memberFunctions.length > 0).map(class_ => {
		    const functions = class_.memberFunctions.map(func => {
                        let args = null
                        let shortArgs = null
                        if (typeof func.parameters !== 'undefined' && func.parameters.length > 0) {
                            args = renderCodeTable(func.parameters)
                            shortArgs = func.parameters.map(x => x.name).join(", ")
                        }
                        let examples = null
                        if (typeof func.examples !== 'undefined' && func.examples.length > 0) {
                            examples = renderExamples(func.examples, "python", func.name)
                        }
			return <div key={func.name}>
				<h4 id={formatAnchorIds(formatShortHandAnchorIds(func.name, shortArgs))}>
					{func.name}({shortArgs})
				</h4>
			    <div data-accordion="collapse"><p>{func.summary}</p>{args}{examples}</div></div>
                        })
			return (<div key={class_.name}>
				<h3 id={formatAnchorIds(class_.name)}>{class_.name}</h3>
				{functions}
			</div>)
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
	// provide entry slug
    const entry = {document: { slug: `python` }}

    const application = await axios.post('https://cloud.terminusdb.com/TerminatorsX/api/graphql/TerminatorsX/CodeDocumentation', {
        query: `query {
            Application(filter: {language: {eq: Python} } ) {
                name,
                modules {
                   name,
                   classes {
                      name,
                      memberFunctions(orderBy: {name: ASC}) {
                          name,
                          examples,
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
    return { props: { application: application.data.data.Application.slice(-1)[0], menu, entry } }
}
