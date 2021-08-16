import { Stack, Atom } from "./stack";

export enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

class Navigator {
  getCurrentItem(
    data: Stack
  ): { unit: Atom; indexX: number; indexY: number } | undefined {
    const focusItem = document.activeElement;

    return data.findByNode(focusItem);
  }

  unselectNode(node: HTMLElement): void {
    node.blur();
  }

  selectNode(oldUnit: Atom | undefined, unit: Atom): void {
    if (oldUnit) {
      this.unselectNode(oldUnit.node);
    }

    unit.node.focus();

    unit.node.addEventListener("blur", () => {
      this.unselectNode(unit.node);
    });
  }

  goTo(
    data: Stack,
    direction: Direction,
    from?: HTMLElement
  ): HTMLElement | undefined {
    const currentItem = this.getCurrentItem(data);
    const fromItem = data.findByNode(from);

    if (!currentItem && !fromItem) {
      const unit = data?.findByIndex(0, 0);
      this.selectNode(undefined, unit);

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { unit: prevItem, indexX, indexY } = currentItem! ?? fromItem!;

    let newItem: HTMLElement | undefined;

    switch (direction) {
      case Direction.DOWN: {
        const unit = data.findByIndex(indexX, indexY + 1);
        this.selectNode(prevItem, unit);

        newItem = unit.node;

        break;
      }

      case Direction.UP: {
        const unit = data.findByIndex(indexX, indexY - 1);
        this.selectNode(prevItem, unit);

        newItem = unit.node;

        break;
      }

      case Direction.RIGHT: {
        const unit = data.findByIndex(indexX + 1, indexY);
        this.selectNode(prevItem, unit);

        newItem = unit.node;

        break;
      }

      case Direction.LEFT: {
        const unit = data.findByIndex(indexX - 1, indexY);
        this.selectNode(prevItem, unit);

        newItem = unit.node;

        break;
      }
    }

    return newItem;
  }
}

export { Navigator };