

export default function ErrorPage({ errorInfo }) {
    return (
        <h3 style={{color: '#333', textAlign: 'center', fontFamily: 'Calibri', margin: 'auto', lineHeight: '100vh'}}>{errorInfo['code']} - {errorInfo['message']}</h3>
    )
}
