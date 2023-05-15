const TerminusClient = require("@terminusdb/terminusdb-client");
const showdown  = require('showdown')
const converter = new showdown.Converter({metadata: true})
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Connect and configure the TerminusClient
const client = new TerminusClient.WOQLClient('https://cloud-dev.terminusdb.com/TerminatorsX',
                                             {user:"robin@terminusdb.com",
                                              organization:'TerminatorsX',
                                              db: "terminusCMS_docs",
                                              token: process.env.TERMINUSDB_API_TOKEN})

function getHtml(entry) {
    return entry['html']
}

export default function Doc( { entry } ) {
    return (
        <div dangerouslySetInnerHTML={{__html: getHtml(entry)}}
        />
    )
}



export async function getStaticPaths() {
    const docs = await client.getDocument({"@type": "Page", as_list: true})
    const paths = docs.filter(x => typeof x['slug'] !== 'undefined' && typeof x['body'] !== 'undefined').map(x => "/" + x["slug"])
    return { paths: paths, fallback: false }
}



export async function getStaticProps({ params }) {
    const query = {
        "@type": "Page",
        "slug": params['name']
    }
    const docs = await client.getDocument({"@type": "Page", as_list: true, query: query})
    const docResult = docs[0]
    const html = converter.makeHtml(docResult['body']['value'])
    const cleanedHtml = DOMPurify.sanitize(html)
    const entry = {html: cleanedHtml, document: docResult }
    return { props: { entry } }
}
