// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'
import { Story } from "@ladle/react";
import { GraphikleProps } from "../components/graphikle/graphikle.types";
import Graphikle from "../components/graphikle/graphikle";
import workerFactory from "./common/msw-worker-helper"
import { rest } from 'msw';

workerFactory.getWorker().use(rest.get('http://localhost:61000/search?term=', (req, res, ctx) => {
    let nodeName:string = "testnode";
    const searchTerm = req.url.searchParams?.get("term") 
    if (searchTerm !== null && searchTerm !== undefined && searchTerm !== "")
    {
      nodeName = searchTerm;
    }

    return res(
      ctx.json(
        {
          'nodes': [
              {
                  'id': `${ nodeName }`,
                  'name': `${ nodeName }`
              },
              {
                  'id': `${ nodeName } 2`,
                  'name': `${ nodeName } 2`
              },
              {
                  'id': `${ nodeName } 3`,
                  'name': `${ nodeName } 3`
              }
          ],
          'links': [
              {
                  'source': `${ nodeName }`,
                  'target': `${ nodeName } 2`
              },
              {
                  'source': `${ nodeName } 2`,
                  'target': `${ nodeName } 3`
              },
              {
                  'source': `${ nodeName } 3`,
                  'target': `${ nodeName }`
              }
          ]
      })
    )
  }
))

export const Graph: Story<GraphikleProps> = ({ id, baseurl, searchterm, graphdata }) => {
  return(
    <>
       <Graphikle 
          id={id}
          baseurl={baseurl}
          searchterm={searchterm}

          nodeClick={nodeClicked}
          nodeRightClick={nodeRightClicked}
          nodeHover={nodeHoveredOver}
          nodeDrag={nodeDragged}
          nodeDragEnd={nodeDragReleased}

          linkClick={linkClicked}
          linkRightClick={linkRightClicked}
          linkHover={linkHoveredOver}

          backgroundClick={backgroundClicked}
          backgroundRightClick={backgroundRightClicked}
        />
    </>
    );
};

Graph.args = {
  id: '3dgraph',
  baseurl: 'http://localhost:61000',
  searchterm: 'search?term='
};

const nodeClicked = (nodeId: string, event: MouseEvent) => {
  alert(`${nodeId} was clicked`)
};

const nodeRightClicked = (nodeId: string, event: MouseEvent) => {
  alert(`${nodeId} was right clicked`)
};

const nodeHoveredOver = (nodeId: string, previousNodeId: string) => {
  if (nodeId === "") {
    console.log(`Node: ${previousNodeId} is no longer hovered over.`)
  } else if (previousNodeId === "") {
    console.log(`Node: ${nodeId} was hovered over`)
  } else
  {
    console.log(`Node: ${nodeId} was hovered over, previous node was ${previousNodeId}`)
  }
};

const nodeDragged = (nodeId: string, x: number, y: number) => {
  console.log(`${nodeId} is being dragged (started at ${x.toString()}, ${y.toString()})`)
};

const nodeDragReleased = (nodeId: string, x: number, y: number) => {
  console.log(`${nodeId} has been released (ended at ${x.toString()}, ${y.toString()})`)
};

const linkClicked = (linkSourceId: string, linkDestinationId:string, event: MouseEvent) => {
  alert(`link left clicked, goes from ${linkSourceId} to ${linkDestinationId}`)
};

const linkRightClicked = (linkSourceId: string, linkDestinationId:string, event: MouseEvent) => {
  alert(`link right clicked, goes from ${linkSourceId} to ${linkDestinationId}`)
};

const linkHoveredOver = (linkSourceId: string, linkTargetId: string, previousLinkSourceId: string, previousLinkTargetId: string) => {
  if (linkSourceId === "") {
    console.log(`Link: ${previousLinkSourceId} --> ${previousLinkTargetId} is no longer hovered over.`)
  } else if (previousLinkSourceId === "") {
    console.log(`Link: ${linkSourceId} --> ${linkTargetId} was hovered over`)
  } else
  {
    console.log(`Link: ${linkSourceId} --> ${linkTargetId} was hovered over, previous node was ${previousLinkSourceId} --> ${previousLinkTargetId}`)
  }
};

const backgroundClicked = (event: MouseEvent) => {
  alert('background was clicked')
};

const backgroundRightClicked = (event: MouseEvent) => {
  alert('background was right clicked')
};
