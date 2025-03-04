import { ContainerNode } from '../core'

import type { SandstoneCore } from '../core'
import type { ConditionNode } from './conditions'

export class IfNode extends ContainerNode {
  nextFlowNode?: IfNode | ElseNode

  constructor(sandstoneCore: SandstoneCore, public condition: ConditionNode, public callback: () => void, reset = true) {
    super(sandstoneCore)

    const currentNode = this.sandstoneCore.getCurrentMCFunctionOrThrow()

    if (reset) {
      currentNode.resource.push(() => sandstoneCore.pack.flowVariable.reset())
    }

    if (callback.toString() !== '() => {}') {
      // Generate the body of the If node.
      currentNode.enterContext(this)
      this.callback()
      currentNode.exitContext()
    }
  }

  getValue = () => {
    throw new Error('Minecraft does not support if statements. This must be postprocessed.')
  }
}

export class IfStatement {
  protected node: IfNode

  constructor(protected sandstoneCore: SandstoneCore, protected condition: ConditionNode, protected callback: () => void) {
    // Generate the body of the If node.
    this.node = new IfNode(sandstoneCore, condition, callback)
  }

  elseIf = (condition: ConditionNode, callback: () => void) => {
    const statement = new IfStatement(this.sandstoneCore, condition, callback)
    this.node.nextFlowNode = statement['getNode']()
    return statement
  }

  else = (callback: () => void) => {
    const statement = new ElseStatement(this.sandstoneCore, callback)
    this.node.nextFlowNode = statement['getNode']()
    return statement
  }

  protected getNode = () => this.node
}

export class ElseNode extends ContainerNode {
  constructor(sandstoneCore: SandstoneCore, public callback: () => void) {
    super(sandstoneCore)

    // Generate the body of the If node.
    this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(this)
    this.callback()
    this.sandstoneCore.currentMCFunction?.exitContext()
  }

  getValue = () => null
}

export class ElseStatement {
  protected node: ElseNode

  constructor(protected sandstoneCore: SandstoneCore, protected callback: () => void) {
    // Generate the body of the If node.
    this.node = new ElseNode(sandstoneCore, callback)
  }

  protected getNode = () => this.node
}
