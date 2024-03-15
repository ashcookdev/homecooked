import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  const navigate = useNavigate();

 // get item from local storage

 const local = localStorage.getItem('selectedItems');
  console.log(local);



  useEffect(() => {
    // Check if the user is authenticated
    if (user) {
      // Retrieve the current authenticated user's information
      Auth.currentAuthenticatedUser().then(userInfo => {
        // Redirect the user to the /confirmation page
        navigate('/confirmation');
        window.location.reload();
      });
    }
  }, [user, navigate]);
  
  return (
    <>
      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </>
  );
  
}

export default withAuthenticator(App);
