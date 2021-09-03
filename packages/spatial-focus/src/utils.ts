import { Position, Row, Unit } from "./stack";

type Size = Record<"x1" | "x2" | "y1" | "y2", number>;

function unitsOverlapPosition(
  prevUnit: Unit,
  nextUnit: Unit,
  direction: "x" | "y"
): boolean {
  if (prevUnit === nextUnit) return false;

  const prevSize = createSize(prevUnit);
  const nextSize = createSize(nextUnit);

  const position1 = `${direction}1` as keyof Size;
  const position2 = `${direction}2` as keyof Size;

  /**
   * [-- prevUnit --]
   * [-- nextUnit --]
   */
  const fitInTailHead =
    nextSize[position1] >= prevSize[position1] &&
    nextSize[position2] <= prevSize[position2];

  /**
   *     [-- prevUnit --]
   * [-- nextUnit --]
   */
  const fitHead =
    prevSize[position1] >= nextSize[position1] &&
    prevSize[position1] <= nextSize[position2];

  /**
   *  [-- prevUnit --]
   *            [-- nextUnit --]
   */
  const fitTail =
    prevSize[position2] >= nextSize[position1] &&
    prevSize[position2] <= nextSize[position2];

  return fitInTailHead || fitHead || fitTail;
}

function createSize(unit: Unit): Size {
  return {
    x1: unit.position.x,
    x2: unit.position.x + unit.position.width,
    y1: unit.position.y,
    y2: unit.position.y + unit.position.height,
  };
}

function getPosition(node: HTMLElement): Position {
  const { x, y, width, height } = node.getBoundingClientRect();

  return { x, y, width, height };
}

function rowFindCloserUnit(
  row: Row,
  unit: Unit,
  direction: "x" | "y"
): Unit | undefined {
  let unitCandidate: undefined | Unit;

  const invertDirection = direction === "x" ? "y" : "x";
  const position1 = `${invertDirection}1` as keyof Size;
  const position2 = `${invertDirection}2` as keyof Size;

  const unitSize = createSize(unit);

  for (const itemRow of row.items) {
    if (itemRow === unit) return;

    if (unitCandidate) {
      const candidateSize = createSize(unitCandidate);
      const itemRowSize = createSize(itemRow);

      if (itemRowSize[position1] > unitSize[position1]) {
        /**
         * Right / Bottom
         */
        const diffCandidateToUnit =
          unitSize[position1] - candidateSize[position2];
        const diffItemRowToUnit = itemRowSize[position1] - unitSize[position2];

        if (diffItemRowToUnit < diffCandidateToUnit) {
          unitCandidate = itemRow;
        }
      } else {
        /**
         * Left / Top
         */
        const diffCandidateToUnit =
          unitSize[position1] - candidateSize[position2];
        const diffItemRowToUnit = itemRowSize[position2] - unitSize[position1];

        if (diffItemRowToUnit < diffCandidateToUnit) {
          unitCandidate = itemRow;
        }
      }
    } else {
      unitCandidate = itemRow;
    }
  }

  return unitCandidate;
}

export { unitsOverlapPosition, createSize, getPosition, rowFindCloserUnit };