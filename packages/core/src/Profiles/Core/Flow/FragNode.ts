import {
  makeFlowNodeDefinition,
  NodeCategory
} from '../../../Nodes/NodeDefinitions.js';
// based on Unreal Engine Blueprint DoN node

export const FragNode = makeFlowNodeDefinition({
  typeName: 'flow/fragNode',
  label: 'FragNode',
  category: NodeCategory.Flow,
  in: {
    flow: 'flow',
    reset: 'flow'
  },
  out: {
    flow: 'flow'
  },
  initialState: {
    firedOnce: false
  },
  triggered: ({ commit, triggeringSocketName, state }) => {
    if (triggeringSocketName === 'reset') {
      return { firedOnce: false };
    }

    if (!state.firedOnce) {
      commit('flow');
      return { firedOnce: true };
    }
    return state;
  }
});
