
import axios from 'axios';
import { renderToStaticMarkup } from 'react-dom/server';
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true, tables: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
import { getMenu, renderCodeTable, renderExamples, formatShortHandAnchorIds, formatAnchorIds } from "../utils"
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
import { Layout } from "../components/_layout"


export default function JavaScript( props ) {
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
                                examples = renderExamples(func.examples, "javascript", func.name)
                            }
                            return <div key={func.name}>
                                <h4 id={formatAnchorIds(formatShortHandAnchorIds(func.name, null))}>
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

	// provide entry slug
    const entry = {document: { slug: `javascript` }}

    const application = await axios.post('https://cloud.terminusdb.com/TerminatorsX/api/graphql/TerminatorsX/CodeDocumentation', {
        query: `query {
            Application(filter: {language: {eq: Javascript} } ) {
                name,
                modules {
                   name,
                   classes(orderBy: {name: ASC}) {
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
