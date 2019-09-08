import {
  map,
  walk,
  getDepth,
  insertNode,
  removeNodeAtPath,
  changeNodeAtPath
} from "react-sortable-tree";

import { isObject, isUndefined, deepmerge } from "@utils";
import { DEFAULT_NODE, IGNORE_COLLAPSED as ignoreCollapsed } from "./constants";

const add = ({ treeData, depth, node, index }) => {
  const { treeData: newTreeData } = insertNode({
    treeData,
    depth,
    getNodeKey,
    newNode: node,
    minimumTreeIndex: index,
    ignoreCollapsed: false,
    expandParent: true
  });
  return newTreeData;
};

export const getTotalNodes = ({ treeData }) => {
  let count = 0;
  walk({
    treeData,
    getNodeKey,
    ignoreCollapsed,
    callback: () => count++
  });
  return count;
};

export const getNodeKey = ({ treeIndex }) => treeIndex;

export const isDescendant = (older, younger) => {
  return (
    !!older.children &&
    older.children.some(
      child =>
        JSON.stringify(child.data) === JSON.stringify(younger.data) || isDescendant(child, younger)
    )
  );
};

export const createNode = (content = {}, source = {}) => {
  if (isObject(content) && isObject(source)) {
    return deepmerge(source, content);
  } else {
    throw new Error("content must be an object & from can be null, undefined or object ");
  }
};

export const getSelected = ({ treeData }) => {
  const matches = [];
  walk({
    treeData,
    getNodeKey,
    ignoreCollapsed: false,
    callback: ({ node, path, treeIndex }) => {
      if (node.selected) {
        matches.push({ node, path, treeIndex });
      }
    }
  });
  return matches;
};

export const getSelectedCountByLevel = ({ treeData }) => {
  const matches = [];
  walk({
    treeData,
    getNodeKey,
    ignoreCollapsed: false,
    callback: ({ node, path }) => {
      if (node.selected) {
        const level = path.length - 1;
        matches[level] = matches[level] || 0;
        matches[level]++;
      }
    }
  });
  return matches;
};

export const addLeaf = ({ treeData, defaultValue }) => {
  const { node: selectedNode, treeIndex: selectedTreeIndex, path: selectedPath } =
    getSelected({
      treeData
    }).pop() || {};
  let depth, index, displayIndex;
  if (selectedNode && !isUndefined(selectedTreeIndex)) {
    depth = selectedNode.children ? selectedPath.length : selectedPath.length - 1;
    index =
      selectedNode.children && selectedNode.children.length
        ? selectedTreeIndex + selectedNode.children.length
        : selectedTreeIndex + 1;
    if (selectedNode.children) {
      displayIndex = selectedNode.children.length;
    } else {
      displayIndex = selectedNode.data.displayIndex + 1;
    }
  } else {
    const lastNode = treeData[treeData.length - 1] || {};
    depth = getDepth(lastNode);
    depth = depth || 1;
    index = getTotalNodes({ treeData });
    displayIndex = lastNode.children ? lastNode.children.length : 0;
  }
  const newNode = createNode({
    ...DEFAULT_NODE(displayIndex, { defaultValue })
  });
  return add({ treeData, depth, node: newNode, index });
};

// need to refactor it for more generic cases add node at nth level
export const addNode = ({ treeData, defaultValue }) => {
  let lastSelectedNode = treeData.filter(node => node.selected).pop() || {};
  let displayIndex = lastSelectedNode.data && lastSelectedNode.data.displayIndex;
  let treeIndex = !isUndefined(displayIndex) ? displayIndex + 1 : treeData.length;
  const newNode = createNode({
    ...DEFAULT_NODE(treeIndex, { defaultValue })
  });
  return add({ treeData, depth: 0, node: newNode });
};

export const duplicate = ({ treeData, node, path, treeIndex }) => {
  const newNode = createNode({}, node);
  return add({
    treeData,
    depth: path.length - 1,
    node: newNode,
    index: treeIndex + 1
  });
};

export const duplicateSelected = ({ treeData }) => {
  const toBeCopied = [];
  let insertIndex = 0;
  walk({
    treeData,
    getNodeKey,
    ignoreCollapsed: false,
    callback: ({ node, path, parentNode, treeIndex }) => {
      if (!(parentNode && parentNode.selected) && node.selected) {
        toBeCopied.push({ path, treeIndex, node });
        insertIndex = insertIndex < treeIndex ? treeIndex : insertIndex;
      }
    }
  });
  return toBeCopied.reduce((treeData, { path, node }, index) => {
    const childrenLength = node.children ? node.children.length : 0;
    const insertIndex = insertIndex + index + childrenLength + 1;
    var c = add({
      treeData,
      depth: path.length - 1,
      index: insertIndex + index + 1,
      node: { ...node, selected: false }
    });
    return c;
  }, treeData);
};

export const remove = ({ treeData, path, node }) => {
  const newTreeData = removeNodeAtPath({
    treeData,
    path,
    getNodeKey
  });
  return { treeData: newTreeData, node: node };
};

export const removeSelected = ({ treeData }) => {
  let pathTobeDeleted;
  let newTreeData = treeData;
  do {
    pathTobeDeleted = null;
    walk({
      treeData: newTreeData,
      getNodeKey,
      ignoreCollapsed,
      callback: ({ node, path, parentNode }) => {
        if (!(parentNode && parentNode.selected) && node.selected) {
          pathTobeDeleted = path;
        }
      }
    });
    if (pathTobeDeleted) {
      newTreeData = removeNodeAtPath({
        treeData: newTreeData,
        path: pathTobeDeleted,
        getNodeKey
      });
    }
  } while (pathTobeDeleted);
  return newTreeData;
};

export const canDrop = obj => {
  const { prevParent, nextParent } = obj;
  if ((nextParent && prevParent) || !(nextParent || prevParent)) {
    return true;
  }
  return false;
};

export const updateNode = ({ treeData, path, node, ignoreCollapsed = ignoreCollapsed }) => {
  const newTreeData = changeNodeAtPath({
    treeData,
    path,
    newNode: node,
    getNodeKey,
    ignoreCollapsed
  });
  return newTreeData;
};

export const toggleChildren = ({
  treeData,
  callback,
  contextNode,
  include = true,
  ignoreCollapsed = ignoreCollapsed
}) => {
  const newTreeData = map({
    treeData,
    getNodeKey,
    callback: ({ node, path }) => {
      if (contextNode) {
        const { data: { id: nodeId } = {} } = node;
        const { data: { id: contextNodeId } = {} } = contextNode;
        if (isDescendant(contextNode, node) || (include && nodeId === contextNodeId)) {
          return callback({ node, path });
        }
        return node;
      }
      return callback({ node, path });
    },
    ignoreCollapsed
  });
  return newTreeData;
};

export const toggleSelection = ({
  treeData,
  node,
  path,
  selected,
  ignoreCollapsed = ignoreCollapsed
}) => {
  selected = isUndefined(selected) ? !node.selected : selected;
  const isDirty = selected !== node.selected;
  const updatedNode = createNode({ selected, isDirty }, node);
  const newTreeData = updateNode({
    treeData,
    path,
    node: updatedNode,
    ignoreCollapsed
  });
  return {
    treeData: newTreeData,
    node: updatedNode
  };
};

export const toggleExpand = ({ treeData, node, path }) => {
  const updatedNode = createNode({ expanded: !node.expanded, isDirty: true }, node);
  const newTreeData = updateNode({ treeData, path, node: updatedNode });
  return {
    treeData: newTreeData,
    node: updatedNode
  };
};

export const unselect = ({ treeData, node, path }) => {
  if (!node.selected) {
    return {
      treeData,
      node
    };
  }
  return toggleSelection({ treeData, node, path, selected: false });
};

export const unselectAll = ({ treeData, contextNode }) => {
  return toggleChildren({
    treeData,
    callback: ({ node, path }) => unselect({ treeData, node, path }).node,
    contextNode
  });
};

export const select = ({ treeData, node, path }) => {
  if (node.selected) {
    return {
      treeData,
      node
    };
  }
  return toggleSelection({ treeData, node, path, selected: true });
};

export const selectAll = ({ treeData, contextNode }) => {
  return toggleChildren({
    treeData,
    callback: ({ node, path }) => select({ treeData, node, path, contextNode }).node,
    contextNode
  });
};

export const setTitle = ({ treeData, value, node, path }) => {
  const newNode = createNode({ data: { name: value }, isDirty: true }, node);
  const newTreeData = updateNode({ treeData, path, node: newNode });
  return {
    node: newNode,
    treeData: newTreeData
  };
};

export const checkAllExpanded = ({ treeData }) => {
  let expanded = true;
  walk({
    treeData,
    getNodeKey,
    ignoreCollapsed,
    callback: ({ node }) => {
      expanded = node.children ? node.expanded : expanded;
    }
  });
  return expanded;
};

export const checkAllSelected = ({ treeData }) => {
  let allSelected = true;
  walk({
    treeData,
    getNodeKey,
    ignoreCollapsed,
    callback: ({ node }) => {
      allSelected = allSelected && node.selected;
    }
  });
  return allSelected;
};

export const getImmediateParent = ({ treeData, node: currentNode }) => {
  let parent = {};
  walk({
    treeData,
    getNodeKey,
    ignoreCollapsed,
    callback: ({ node, parentNode = {} }) => {
      if (node.data.id === currentNode.data.id) {
        parent = parentNode;
      }
    }
  });
  return parent;
};

export const isCrossParentSelection = ({ treeData, node: currentNode }) => {
  let isCross;
  const { data: { id: currentParentId } = {} } =
    getImmediateParent({
      treeData,
      node: currentNode
    }) || {};
  walk({
    treeData,
    getNodeKey,
    ignoreCollapsed,
    callback: ({ node, parentNode: parent }) => {
      const parentId = parent && parent.data ? parent.data.id : undefined;
      if (node.selected && isUndefined(isCross)) {
        if (parentId == currentParentId) {
          isCross = false;
        } else {
          isCross = true;
        }
      }
    }
  });
  return isCross;
};
