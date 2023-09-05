import Alert from 'react-bootstrap/Alert'
export function MessageBox(props){
    return(
        <Alert variant={props.variant || 'info'}>{props.children}</Alert>
    )
}