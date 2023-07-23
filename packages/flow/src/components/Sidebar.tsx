import { NodeSpecJSON } from '@behave-graph/core';
import React, { useEffect, useState } from 'react';
import { useReactFlow, XYPosition } from 'reactflow';

import { useOnPressKey } from '../hooks/useOnPressKey.js';
import Arrow from '../util/Arrow.js';

export type SidebarFilters = {
  handleType: 'source' | 'target';
  valueType: string;
};

type SidebarProps = {
  position: XYPosition;
  filters?: SidebarFilters;
  onPickNode: (type: string, position: XYPosition) => void;
  onClose: () => void;
  specJSON: NodeSpecJSON[] | undefined;
};

export const Sidebar: React.FC<SidebarProps> = ({
  position,
  filters,
  onPickNode,
  onClose,
  specJSON
}: SidebarProps) => {
  const [search, setSearch] = useState('');
  const [sidebarMenu, setSidebarMenu] = useState([]);
  const [activeSidebarMenu, setActiveSidebarMenu] = useState('');
  const [nodes, setNodes] = useState<NodeSpecJSON[]>([]);
  const [filtered, setFiltered] = useState<NodeSpecJSON[]>([]);
  const instance = useReactFlow();

  useOnPressKey('Escape', onClose);

  useEffect(() => {
    if (specJSON) {
      if (filters) {
        const nodesData = specJSON?.filter((node: any) => {
          const sockets =
            filters?.handleType === 'source' ? node.outputs : node.inputs;
          return sockets.some(
            (socket: any) => socket.valueType === filters?.valueType
          );
        });
        console.log(
          '🚀 ~ file: Sidebar.tsx:45 ~ useEffect ~ nodesData:',
          nodesData
        );
        setNodes(nodesData);
        setFiltered(nodesData);
      } else {
        let a = [
          { foo: 1, bar: 'a' },
          { foo: 2, bar: 'b' },
          { foo: 1, bar: 'c' },
          { foo: 2, bar: 'd' }
        ];

        const sidebarData: any = Object.values(
          specJSON.reduce((x: any, y: any) => {
            if (!x[y.category]) x[y.category] = [];
            x[y.category].push(y);
            return x;
          }, {})
        );

        setNodes(specJSON);
        setFiltered(specJSON);
        setSidebarMenu(sidebarData);
      }
    }
  }, [specJSON]);

  useEffect(() => {
    if (search && search.trim() !== '') {
      const filteredData =
        nodes?.filter((node) => {
          const term = search.toLowerCase();
          return node.type.toLowerCase().includes(term);
        }) || [];
      setFiltered(filteredData);
    }
  }, [search]);

  return (
    <div className="node-picker absolute h-screen w-[250px] z-10 text-sm text-white bg-gray-800 border-r border-gray-500">
      <div className="h-10 bg-gray-500 p-2">Behave flow</div>
      <div className="h-12 p-2">
        <input
          type="text"
          autoFocus
          placeholder="Type to filter"
          className=" bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {search && search.trim() !== '' ? (
        <div className="h-[calc(100vh-88px)] overflow-y-scroll">
          {filtered.map(({ type }) => (
            <div
              key={type}
              className="p-2 cursor-pointer border-b border-gray-600"
              onClick={() => onPickNode(type, instance.project(position))}
            >
              {type}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[calc(100vh-88px)] overflow-y-scroll">
          {sidebarMenu.map((subMenu: any) => (
            <div
              style={{
                backgroundColor:
                  activeSidebarMenu === subMenu[0].category ? '#273445' : ''
              }}
              key={subMenu[0].category}
              className="cursor-pointer border-b border-gray-600"
            >
              <div
                className="p-2"
                onClick={() =>
                  setActiveSidebarMenu(
                    activeSidebarMenu === subMenu[0].category
                      ? ''
                      : subMenu[0].category
                  )
                }
              >
                {subMenu[0].category}
                <Arrow isOpen={activeSidebarMenu === subMenu[0].category} />
              </div>
              <div
                className={
                  activeSidebarMenu === subMenu[0].category ? '' : 'hidden'
                }
              >
                {subMenu.map(({ type }: any) => (
                  <div
                    key={type}
                    className="p-2 cursor-pointer border-t border-gray-600"
                    onClick={() => onPickNode(type, instance.project(position))}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
