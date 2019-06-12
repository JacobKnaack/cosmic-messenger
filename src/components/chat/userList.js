import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Socket from '../../lib/socket.js';

const GET_USERS = gql`
  query UserList($read_key: String!) {
    objectsByType(bucket_slug: "cosmic-messenger", type_slug: "users", read_key: $read_key ) {
      _id
      title
      created_at
      metadata
    }
  }
`

class UserList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    Socket.subscribeToRegister(this.props.data.refetch);
    Socket.subscribeToLogout(this.props.data.refetch);
  }

  static getDerivedStateFromProps(props, state) {
    const tempState = Object.assign({}, state)
    if (props.data.objectsByType) {
      tempState.users = props.data.objectsByType
    }

    return tempState
  }

  render() {
    const styles = {
      container: {
        width: '200px',
        height: 'calc(100% - 175px)',
        paddingRight: '40px',
        position: 'fixed',
        zIndex: '102',
        color: '#a9a9a9',
        top: '62px',
        left: '0',
        overflowY: 'auto',
        transition: '0.3s ease-in-out',
      },
      noUsers: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }

    return (
      <div className={`userList-container ${this.props.mobileMenuActive}`} style={styles.container}>
        {this.state.users.map(user => {
          if (user._id !== this.props.user._id) {
            return (
              <p key={user._id}>{user.title}</p>
            )
          }

          return null
        })}
        {this.state.users.length < 2
          ? <div style={styles.noUsers}>No Users in chat</div>
          : null
        }
      </div>
    )
  }
}

export default graphql(GET_USERS, {
  options: {
    variables: {
      read_key: __COSMIC_READ_KEY__,
    }
  },
  props: ({ data }) => ({
    data,
  })
})(UserList);