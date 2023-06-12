
import axios from 'axios';
import { CollapseSidebar } from "../components/_collapseSidebar"
import { OnThisPageContent } from "../components/_onThisPage"
import { renderToStaticMarkup } from 'react-dom/server';
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true, tables: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
import { getMenu, renderCodeTable, renderExamples } from "../utils"
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window); 


export default function JavaScript( props ) {
	const modules = props.application.modules
	const layout = modules.map(mod => {
		const classes = mod.classes.map(class_ => {
		    const functions = class_.memberFunctions.map(func => {
                        let args = null
                        let shortArgs = null
                        if (typeof func.parameters !== 'undefined' && func.parameters.length > 0) {
                            args = renderCodeTable(func.parameters)
                            shortArgs = func.parameters.map(x => x.name).join(", ")
                        }
                        let examples = null
                        if (typeof func.examples !== 'undefined' && func.examples.length > 0) {
                            examples = renderExamples(func.examples, "javascript")
                        }
                        return <div key={func.name}><h4 id={func.name}>{func.name}({shortArgs})</h4><p>{func.summary}</p>{examples}<div data-accordion="collapse">{args}</div></div>
                        })
			return (<div key={class_.name}><h3 id={class_.name}>{class_.name}</h3>{functions}</div>)
		})
		return (<div key={mod.name}><h2 id={mod.name}>{ mod.name }</h2>{ classes }</div>)
	})
	const html = renderToStaticMarkup(layout);
	const cleanedHtml = DOMPurify.sanitize(html);
	

	return <div className='bg-gray-50 dark:bg-gray-800'> 
		<CollapseSidebar {...props}/>
		{/*<div className="flex p-4 sm:ml-96 p-4 sm:ml-96 h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 fixed">*/}
    <div className="flex p-4 sm:ml-96 p-4 sm:ml-96 h-screen px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
			<div className="pl-20 rounded-lg font-normal max-w-4xl">
				<h1>{ props.application.name }</h1>
				{ layout }
				<OnThisPageContent html={cleanedHtml}/>
			</div>
		</div>
	</div>
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
    return { props: { application: application.data.data.Application.slice(-1)[0], menu } }
}
