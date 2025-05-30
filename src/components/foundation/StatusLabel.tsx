export interface StatusLabelProps {
  status: StatusLabelStatus;
  label: string;
}

export const StatusLabel = ({ status, label }: StatusLabelProps) => {
  return (
    <div
      className={`${status} flex flex-row justify-center items-center px-2 py-1 rounded`}
    >
      <div className="circle rounded-full w-3 h-3 aspect-square" />
      <p className="font-bold ml-2 body-2">{label}</p>
    </div>
  );
};

export enum StatusLabelEnum {
  SUCCESS = 'success',
  NEUTRAL = 'neutral',
  ERROR = 'error',
  EMPTY = 'empty',
  PARTIAL_APPROVAL = 'partialapproval',
}

export type StatusLabelStatus =
  (typeof StatusLabelEnum)[keyof typeof StatusLabelEnum];

// Define a custom sort order for the statuses
export const StatusLabelSortOrder: Record<StatusLabelStatus, number> = {
  [StatusLabelEnum.SUCCESS]: 1,
  [StatusLabelEnum.PARTIAL_APPROVAL]: 2,
  [StatusLabelEnum.NEUTRAL]: 3,
  [StatusLabelEnum.EMPTY]: 4,
  [StatusLabelEnum.ERROR]: 5,
};

// Function to compare statuses based on the custom sort order
export const compareStatusLabels = (
  a: StatusLabelStatus,
  b: StatusLabelStatus,
): number => {
  return StatusLabelSortOrder[a] - StatusLabelSortOrder[b];
};
