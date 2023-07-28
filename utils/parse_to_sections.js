import process from 'node:process';
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

const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time))

async function pollingCall (commitid, callBack) {
  try {
    const pollingUrl = `${getChangesUrl('indexes')}/${commitid}/check`
    const document = await client.sendCustomRequest('GET', pollingUrl)
    if (document.indexing_status !== 'Assigned' && document.indexing_status !== 'Error') {
      await timeout(10000)
      await pollingCall(commitid, callBack)
    } else {
      return callBack(document)
    }
  } catch (err) {
    console.log(err.message)
    clearTimeout(timeout)
  }
}

function callBack (document) {
  if (document.indexing_status === 'Error') {
    console.log('Error', document.error_message)
  } else {
    console.log('Finished')
  }
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
  const sections = await client.getDocument({as_list: true, type: 'Sections'})
  const sectionIds = sections.map(x => x['@id'])
  await client.deleteDocument({id: sectionIds})
  await client.updateDocument(docs, {create: true}, "", "Update sections from script")
  try {
    const response = await mergeChangeRequest(changeRequestId)
    if (response.tracking_branch_last_commit) {
      // or maybe you can put an await
      pollingCall(response.tracking_branch_last_commit, callBack)
    }
  }
  catch (err) {
    const message = err.data && typeof err.data === 'object' ? JSON.stringify(err.data, null, 4) : err.message
    process.exit(1);
    console.log('ERROR', message)
  }
}

main()
