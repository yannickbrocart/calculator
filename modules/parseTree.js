/**
 * --------------------------------------------------------------------------
 * Calculator parseTree.js
 * Licensed under MIT (https://github.com/yannickbrocart/calculator/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Class definition
 */

class ParseTree {
    // Fields
    root  = null;
    left  = null;
    right = null;

    // Constructor
    constructor(root, left, right) {
        this.root  = root;
        this.left  = left;
        this.right = right;
    }

    // Getters
    getTree() {
        return this;
    }

    getRoot() {
        return this.root;
    }

    getLeft() {
        return this.left;
    }

    getRight() {
        return this.right;
    }

    // Public
    reset() {
        this.root  = undefined;
        this.left  = undefined;
        this.right = undefined;
    }

    addItem(
        element,
        type,
        tree = this) {
            if (type === 'number') {
            if (this.left === undefined)
                this.left = element;
            else if (this.right === undefined)
                this.right = element;
            else this.right.right = element;
        } else if (type === 'operator') {
            if (this.root === undefined)
                this.root = element;
            else {
                const clone = structuredClone(this);
                this.left = clone;
                this.root = element;
                this.right = undefined;
            }
        }
    }

    calculate() {
        return this.evaluate(this);
    }

    evaluate(node) {
        if (node.left !== undefined || node.right !== undefined) {
            let leftValue = typeof node.left === 'object' ? this.evaluate(node.left) : node.left;
            let rightValue = typeof node.right === 'object' ? this.evaluate(node.right) : node.right;
            switch (node.root) {
                case '+': return parseFloat(leftValue) + parseFloat(rightValue);
                case '-': return parseFloat(leftValue) - parseFloat(rightValue);
            }
        } else return node.root;
    }
}