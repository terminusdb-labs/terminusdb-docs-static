const { marked } = require('marked')
const TerminusClient = require("@terminusdb/terminusdb-client");
const client = new TerminusClient.WOQLClient('https://cloud.terminusdb.com/TerminatorsX',
                                             {organization:'TerminatorsX', db: 'terminusCMS_docs'})
client.setApiKey(process.env.TERMINUSDB_API_TOKEN)



function getChangesUrl (action = 'changes') {
  const clientCopy = client.copy()
  clientCopy.connectionConfig.api_extension = 'api/'
  if (clientCopy.connectionConfig.baseServer) {
    clientCopy.connectionConfig.server = clientCopy.connectionConfig.baseServer
  }
  return clientCopy.connectionConfig.dbBase(action)
}

async function createCR () {
  const payload = {
    original_branch: 'main',
    name: `CR_indexing__${Date.now()}`,
    message: 'Create change request for indexing',
    author: client.user()
  }

  const createURL = getChangesUrl()

  const result = await client.sendCustomRequest('POST', createURL, payload)
  return result
}

async function mergeChangeRequest (currentCR) {
  // I need to submit the change request before merge it
  await client.sendCustomRequest('PUT', `${getChangesUrl()}/${currentCR}`, { message: 'Submitted CR', status: 'Submitted' })
  // I merge the change request,  this will trigger the indexing process
  return await client.sendCustomRequest('PUT', `${getChangesUrl()}/${currentCR}`, { message: 'MERGED CR', status: 'Merged' })
}


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
  const { changeRequestId, branchName } = await createCR()
  client.checkout(branchName)
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
