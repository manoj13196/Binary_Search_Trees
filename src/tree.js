// src/tree.js

import Node from './node.js';

export default function Tree(array) {
  let root = buildTree([...new Set(array)].sort((a, b) => a - b)); // Remove duplicates & sort

  // Build balanced BST recursively
  function buildTree(array) {
    if (array.length === 0) return null;
    const mid = Math.floor(array.length / 2);
    const node = Node(array[mid]);
    node.left = buildTree(array.slice(0, mid));
    node.right = buildTree(array.slice(mid + 1));
    return node;
  }

  // Insert value into BST
  function insert(value, node = root) {
    if (!node) return Node(value);
    if (value < node.data) {
      node.left = insert(value, node.left);
    } else if (value > node.data) {
      node.right = insert(value, node.right);
    }
    return node;
  }

  // Delete value from BST
  function deleteItem(value, node = root) {
    if (!node) return null;

    if (value < node.data) {
      node.left = deleteItem(value, node.left);
    } else if (value > node.data) {
      node.right = deleteItem(value, node.right);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      let successor = node.right;
      while (successor.left) successor = successor.left;
      node.data = successor.data;
      node.right = deleteItem(successor.data, node.right);
    }
    return node;
  }

  // Find node with value
  function find(value, node = root) {
    if (!node || node.data === value) return node;
    return value < node.data ? find(value, node.left) : find(value, node.right);
  }

  // Level order traversal (Breadth First Search)
  function levelOrder(callback) {
    if (!callback) throw new Error("Callback required");
    const queue = [root];
    while (queue.length > 0) {
      const current = queue.shift();
      callback(current);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }

  // Depth-first traversals
  function inOrder(callback, node = root) {
    if (!callback) throw new Error("Callback required");
    if (!node) return;
    inOrder(callback, node.left);
    callback(node);
    inOrder(callback, node.right);
  }

  function preOrder(callback, node = root) {
    if (!callback) throw new Error("Callback required");
    if (!node) return;
    callback(node);
    preOrder(callback, node.left);
    preOrder(callback, node.right);
  }

  function postOrder(callback, node = root) {
    if (!callback) throw new Error("Callback required");
    if (!node) return;
    postOrder(callback, node.left);
    postOrder(callback, node.right);
    callback(node);
  }

  // Height = edges from node to deepest leaf
  function height(node) {
    if (!node) return -1;
    return 1 + Math.max(height(node.left), height(node.right));
  }

  // Depth = edges from root to given node
  function depth(target, node = root, currentDepth = 0) {
    if (!node) return -1;
    if (node === target) return currentDepth;
    return target.data < node.data
      ? depth(target, node.left, currentDepth + 1)
      : depth(target, node.right, currentDepth + 1);
  }

  // Check if tree is balanced
  function isBalanced(node = root) {
    if (!node) return true;
    const diff = Math.abs(height(node.left) - height(node.right));
    return diff <= 1 && isBalanced(node.left) && isBalanced(node.right);
  }

  // Rebalance tree from inOrder traversal
  function rebalance() {
    const values = [];
    inOrder((node) => values.push(node.data));
    root = buildTree(values);
  }

  // Pretty print tree
  function prettyPrint(node = root, prefix = "", isLeft = true) {
    if (node === null) return;
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  return {
    root,
    insert,
    deleteItem,
    find,
    levelOrder,
    inOrder,
    preOrder,
    postOrder,
    height,
    depth,
    isBalanced,
    rebalance,
    prettyPrint,
  };
}
