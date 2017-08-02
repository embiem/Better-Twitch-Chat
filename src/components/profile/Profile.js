import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';

class Profile extends React.Component {
  render() {
    const { user } = this.props;
    const isLoggedIn =
      user.firebaseUser && !user.firebaseUser.isAnonymous && user.twitchUser;

    return (
      <div className="container-center">
        <Card className="container">
          <CardTitle title="Profile" />
          <CardText>
            {isLoggedIn
              ? `You're logged in as ${user.firebaseUser.displayName}.`
              : `You're not logged-in.`}
          </CardText>
          <CardActions>
            {isLoggedIn
              ? <RaisedButton
                  label="Log-Out"
                  primary={true}
                  onTouchTap={() => firebase.auth().signOut().then(() => window.location.reload())}
                />
              : <RaisedButton
                  label="Log-In"
                  primary={true}
                  onTouchTap={() =>
                    window.open(
                      `${window.location.origin}/popup`,
                      'name',
                      'height=585,width=400'
                    )}
                />}
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(Profile);
