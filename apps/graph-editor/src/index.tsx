import 'reactflow/dist/style.css';
import './styles.css';

import { GraphJSON } from '@behave-graph/core';
import { Examples, Flow } from '@behave-graph/flow';
import React from 'react';
import ReactDOM from 'react-dom/client';

import Branch from '../../../graphs/core/flow/Branch.json';
import HelloWorld from '../../../graphs/core/HelloWorld.json';
import Polynomial from '../../../graphs/core/logic/Polynomial.json';
import Delay from '../../../graphs/core/time/Delay.json';
import SetGet from '../../../graphs/core/variables/SetGet.json';
import rawGraph from './graph.json';

const graph = rawGraph as unknown as GraphJSON;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// TODO remove when json types fixed in behave-graph
const examples: Examples = {
  branch: Branch as unknown as GraphJSON,
  delay: Delay as unknown as GraphJSON,
  helloWorld: HelloWorld as unknown as GraphJSON,
  polynomial: Polynomial as unknown as GraphJSON,
  setGet: SetGet as unknown as GraphJSON
} as Record<string, GraphJSON>;

root.render(
  <React.StrictMode>
    <Flow initialGraph={graph} examples={examples} />
  </React.StrictMode>
);
