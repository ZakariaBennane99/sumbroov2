function Custom404() {

  return (<div className='Error-container'>
      <h1 style={{ fontSize: '2.5em' }}>Page Not Found</h1>
      <img src="/404.svg" />
      <button style={{ width: 'fit-content', 
        padding: '15px 25px 15px 25px', 
        fontSize: '1.5em',
        marginBottom: '70px' }}>Go Back To The Homepage</button>
    </div>
  );
}
  
export default Custom404;
  

export async function getServerSideProps() {

  return {
    props: {
      notProtected: true,
      isErr404: true
    }
  };

}