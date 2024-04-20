export const sum = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

export const maxValsForEachPos = (arr1: number[], arr2: number[]): number[] => {
  return arr1.map((val, i) => Math.max(val, arr2[i]));
};

export const minValsForEachPos = (arr1: number[], arr2: number[]): number[] => {
  return arr1.map((val, i) => Math.min(val, arr2[i]));
};
