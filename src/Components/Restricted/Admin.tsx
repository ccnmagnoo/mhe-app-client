import { User } from 'firebase/auth';
import React from 'react';
import { auth } from '../../Config/firebase';

export const Admin = (props: { history: string[] }) => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (auth.currentUser) {
      //🟩
      console.log('authentication', true, user?.uid);
      setUser(auth.currentUser);
    } else {
      //🟥
      console.log('authentication', false);
      props.history.push('/admin');
    }
  }, [props.history, user]);

  return <React.Fragment></React.Fragment>;
};

//export default withRouter(Admin);
