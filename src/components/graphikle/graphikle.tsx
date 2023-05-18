// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useRef } from 'react'
import styled from 'styled-components'
import ForceGraph3D, { LinkObject, NodeObject } from 'react-force-graph-3d'
import { GraphikleProps } from './graphikle.types'
import { IGraphData } from './igraphdata'
import DataService from './graphikle_dataService'
import { ForceGraph3DInstance } from '3d-force-graph'
import * as three from "three"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

export const StyledGraphikle = styled.div<GraphikleProps>`
  id: ${props => props.id};
  searchterm: ${props => props.searchterm};
`;

const Graphikle: React.FC<GraphikleProps> = ({ ...props }) => {
  const { nodeClick, nodeRightClick, nodeHover, nodeDrag, nodeDragEnd, linkClick, linkRightClick, linkHover, backgroundClick, backgroundRightClick } = props;
  const graphRef = React.createRef<ForceGraph3DInstance>();
  const [graphData, setGraphData] = React.useState<IGraphData>();
  const [currentsearchterm, setCurrentSearchTerm] = React.useState<string>("");

  const getSearchData = () => {
      DataService.getBySearchTerm(props.baseurl, props.searchterm).then((response: any) => { 
        setCurrentSearchTerm(props.searchterm);
        setGraphData(response.data);
    }).catch((e: Error) => { 
      console.log(e); 
    });
  };

  if (currentsearchterm !== props.searchterm)
  {
    getSearchData();
  }

  React.useEffect(() => {
    const bloomPass = new UnrealBloomPass(new three.Vector2(),3,1,0.1);
    graphRef.current.postProcessingComposer().addPass(bloomPass);
  },[]);


  const castNodeToString = (node: NodeObject | null) => {
    if (node === null) return "";
    switch(typeof node.id){
      case 'string':
        return node.id;
        break;
      case 'number':
        return node.id.toString();
        break;
      default:
        return "";
    }
  }

  const castLinkToString = (link: string | number | NodeObject | null) => {
    if (link === null) return "";
    switch(typeof link){
      case 'string':
        return link;
        break;
      case 'number':
        return link.toString();
        break;
      default:
        return link.id.toString();
        break;
    }
  }

  const handleOnNodeClick = (node: NodeObject, event: MouseEvent) => {
    nodeClick(node.id.toString(), event);
  }

  const handleOnNodeDrag = (node: NodeObject, translate: { x: number, y: number }) => {
    nodeDrag(node.id.toString(), translate.x, translate.y);
  }

  const handleOnNodeDragEnd = (node: NodeObject, translate: { x: number, y: number }) => {
    nodeDragEnd(node.id.toString(), translate.x, translate.y);
  }

  const handleOnNodeHover = (node: NodeObject | null, previousNode: NodeObject | null) => {
    const idNode = castNodeToString(node);
    const idPreviousNode = castNodeToString(previousNode);
    nodeHover(idNode, idPreviousNode);
  }

  const handleOnNodeRightClick= (node: NodeObject, event: MouseEvent) => {
    nodeRightClick(node.id.toString(), event);
  }

  const handleOnLinkClick = (link: LinkObject, event: MouseEvent) => {
    const idSource = castLinkToString(link.source);
    const idTarget = castLinkToString(link.target);
    linkClick(idSource, idTarget, event);
  }

  const handleOnLinkRightClick = (link: LinkObject, event: MouseEvent) => {
    const idSource = castLinkToString(link.source);
    const idTarget = castLinkToString(link.target);
    linkRightClick(idSource, idTarget, event);
  }

  const handleOnLinkHover = (link: LinkObject | null, previousLink: LinkObject | null) => {
    const idSource = link === null ? "" : castLinkToString(link.source);
    const idTarget = link === null ? "" : castLinkToString(link.target);
    const idPreviousSource = previousLink === null ? "" : castLinkToString(previousLink.source);
    const idPreviousTarget = previousLink === null ? "" : castLinkToString(previousLink.target);
    linkHover(idSource, idTarget, idPreviousSource, idPreviousTarget);
  }

  const handleOnBackgroundClick = (event: MouseEvent) => {
    backgroundClick(event);
  }

  const handleOnBackgroundRightClick = (event: MouseEvent) => {
    backgroundRightClick(event);
  }

  return(
    <>
      <StyledGraphikle {...props} data-testid={'GraphikleTestId'}>
        <ForceGraph3D 
          width={800}
          height={600}
          showNavInfo={false}
          ref={graphRef}
          cooldownTicks={100}
          graphData={graphData}
          nodeAutoColorBy="name"
          onNodeClick={handleOnNodeClick}
          onNodeDrag={handleOnNodeDrag}
          onNodeDragEnd={handleOnNodeDragEnd}
          onNodeHover={handleOnNodeHover}
          onNodeRightClick={handleOnNodeRightClick}

          onLinkClick={handleOnLinkClick}
          onLinkHover={handleOnLinkHover}
          onLinkRightClick={handleOnLinkRightClick}
          
          onBackgroundClick={handleOnBackgroundClick}
          onBackgroundRightClick={handleOnBackgroundRightClick}
        />
      </StyledGraphikle>
    </>
  );
};

export default Graphikle;