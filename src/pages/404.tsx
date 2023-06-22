import { Layout } from "../components/_layout"
import menu from "../menu.json"

export default function Custom404() {
    const not_found = <p>
        We&quot;ve moved our documentation from Gitbook to TerminusCMS to improve the user experience.
        Some URLs have changed and we&quot;re waiting for the search engines to catch up.
        Please use the menu to find what you were looking for.</p>
    return <Layout menu={menu}
//        entry={props.entry}
        displayElement={not_found} 
        heading="404 not found"
       // subtitle={getSubTitle(props.entry.document)}
     />
}
