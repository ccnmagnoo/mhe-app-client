import React from 'react';
import { withRouter } from 'react-router-dom';
import { auth, firebase } from '../../Config/firebase';

export const Admin = (props: { history: string[] }) => {
  const [user, setUser] = React.useState<firebase.User | null>(null);

  React.useEffect(() => {
    if (auth.currentUser) {
      //🟩
      console.log('authentication', true);
      setUser(auth.currentUser);
    } else {
      //🟥
      console.log('authentication', false);
      props.history.push('/admin');
    }
  }, [props.history]);

  return <React.Fragment></React.Fragment>;
};

//export default withRouter(Admin);
