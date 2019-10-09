import {AppStateWithHistory, MultiplayerState, SettingsType} from 'app/reducers/StateTypes';
import {connect} from 'react-redux';
import Redux from 'redux';
import {ParserNode} from '../TemplateTypes';
import {
  handleCombatTimerHold,
  handleCombatTimerStop,
} from './Actions';
import NoTimer, {DispatchProps, StateProps} from './NoTimer';
import {mapStateToProps as mapStateToPropsBase} from './Types';

const mapStateToProps = (state: AppStateWithHistory, ownProps: Partial<StateProps>): StateProps => {
  const node = ownProps.node;
  if (!node) {
    throw Error('Incomplete props given');
  }
  return {
    ...mapStateToPropsBase(state, ownProps),
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>): DispatchProps => {
  return {
    onTimerStop: (node: ParserNode, settings: SettingsType, elapsedMillis: number, surge: boolean, seed: string, multiplayer: MultiplayerState) => {
      // We don't want to **stop** the timer if we're connected to remote
      // play. Rather, we want to wait until everyone's timer is stopped
      // before moving on.
      // The server will tell us once everyone's ready.
      if (multiplayer.connected) {
        dispatch(handleCombatTimerHold({elapsedMillis}));
      } else {
        dispatch(handleCombatTimerStop({node, settings, elapsedMillis, seed}));
      }
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoTimer);
