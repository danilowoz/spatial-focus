import { Stack, Unit, UnitIndex } from "./stack";

export enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

class Navigator {
  getCurrentItem(data: Stack): UnitIndex | undefined {
    const focusItem = document.activeElement;

    return data.findUnitByNode(focusItem);
  }

  unselectNode(node: HTMLElement): void {
    node.blur();
  }

  selectNode(oldUnit: Unit | undefined, unit: Unit): void {
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
    const fromItem = data.findUnitByNode(from);

    if (!currentItem && !fromItem) {
      const unit = data?.findByIndex(0, 0);
      this.selectNode(undefined, unit);

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const candidate = currentItem! ?? fromItem!;
    const { unit: prevUnit, indexX, indexY } = candidate;

    let newItem: HTMLElement | undefined;

    switch (direction) {
      case Direction.DOWN: {
        const unit = data.findColumn(prevUnit, { prev: false });

        if (unit) {
          this.selectNode(prevUnit, unit);
          newItem = unit.node;
        }

        break;
      }

      case Direction.UP: {
        const unit = data.findColumn(prevUnit, { prev: true });

        if (unit) {
          this.selectNode(prevUnit, unit);
          newItem = unit.node;
        }

        break;
      }

      case Direction.RIGHT: {
        const unit = data.findByIndex(indexX + 1, indexY);
        this.selectNode(prevUnit, unit);

        newItem = unit.node;

        break;
      }

      case Direction.LEFT: {
        const unit = data.findByIndex(indexX - 1, indexY);
        this.selectNode(prevUnit, unit);

        newItem = unit.node;

        break;
      }
    }

    return newItem;
  }
}

export { Navigator };
