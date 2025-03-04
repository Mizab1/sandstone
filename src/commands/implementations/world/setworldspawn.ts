import { CommandNode } from '#core/nodes'
import { coordinatesParser } from '#variables'

import { CommandArguments } from '../../helpers'

import type { Coordinates, Rotation } from '#arguments'

export class SetWorldSpawnCommandNode extends CommandNode {
  command = 'setworldspawn' as const
}

export class SetWorldSpawnCommand extends CommandArguments {
  protected NodeType = SetWorldSpawnCommandNode

  /**
   * Sets the world spawn.
   *
   * @param pos Specifies the coordinates of the world spawn. If not specified, defaults to the block position of the command's execution.
   *
   * @param angle Specified the yaw angle to spawn with. Defaults to the direction the executor is facing.
   */
  setworldspawn = (pos?: Coordinates, angle?: Rotation) => this.finalCommand([coordinatesParser(pos), coordinatesParser(angle)])
}
