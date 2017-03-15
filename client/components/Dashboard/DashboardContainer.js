import Relay from 'react-relay';
import Dashboard from './DashboardComponent';

export default Relay.createContainer(Dashboard, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Admin{
        id,
        email,
        name
      }`
  }
});
