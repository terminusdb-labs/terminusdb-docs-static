const { marked } = require('marked')
const TerminusClient = require("@terminusdb/terminusdb-client");
const client = new TerminusClient.WOQLClient('https://cloud.terminusdb.com/TerminatorsX',
                                             {organization:'TerminatorsX', db: 'terminusCMS_docs'})
client.setApiKey(process.env.TERMINUSDB_API_TOKEN)

function parseDocument(document) {
  const mdBody = document['body'].value
  const tokens = marked.lexer(mdBody, {})
  const constructedDocument = []
  let lastDocument = null
  tokens.forEach(token => {
    if (token.type === 'heading') {
      if (lastDocument !== null) {
        constructedDocument.push(lastDocument)
      }
      lastDocument = {'@type': 'Sections', 'title': { value: token.text }, 'body': {value: ''} }
    }
    if (lastDocument !== null && token.type === 'paragraph') {
      lastDocument.body.value = lastDocument.body.value + token.text + "\n\n"
    }
  })
  return constructedDocument
}

async function main() {
  const docs = await client.getDocument({as_list: true, type: 'Page'})
  const newDocs = []
  for (let doc of docs) {
    if (typeof doc['body'] !== 'undefined') {
      const sections = parseDocument(doc)
      doc['sections'] = sections
      newDocs.push(doc)
    }
  }
  await client.updateDocument(docs, {create: true}, "", "Update sections from script")
}

main()
