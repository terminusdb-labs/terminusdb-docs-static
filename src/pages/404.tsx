import { Layout } from "../components/_layout"
import menu from "../menu.json"

export default function Custom404() {
    const not_found = <p>Could not find the requested page</p>
    return <Layout menu={menu}
//        entry={props.entry}
        displayElement={not_found} 
        heading="404 not found"
       // subtitle={getSubTitle(props.entry.document)}
     />
}
