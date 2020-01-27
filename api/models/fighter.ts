import { IProfile, ITarget, IFighter, TMatrix, TVector, IFighterProbability } from '../types';
import { D6 } from './dice';

const generatePermutations = <T>(vector: T[], n = 1): T[][] => {
  if (n === 0) return [[]];
  return generatePermutations(vector, n - 1).reduce<T[][]>(
    (acc, x) => acc.concat(vector.map(c => [c, ...x])),
    [],
  );
};

class Fighter implements IFighter {
  name: string;
  profile: IProfile;

  constructor(name: string, profile: IProfile) {
    this.name = name;
    this.profile = profile;
  }

  getProbabilities(target: ITarget): IFighterProbability {
    const permutations = this.getReducedPermutations(target);
    const numPermutations = permutations.length;
    const counts = permutations.reduce<{ [val: number]: number }>(
      (acc, result) => ({
        ...acc,
        [result]: (acc[result] || 0) + 1,
      }),
      {},
    );
    const buckets = Object.keys(counts)
      .map(Number)
      .sort((x, y) => x - y)
      .map(damage => ({
        damage,
        count: counts[damage],
        probability: (counts[damage] * 100) / numPermutations,
      }));
    const metrics = {
      max: Math.max(...Object.keys(counts).map(Number)),
    };
    return {
      buckets,
      metrics,
    };
  }

  getReducedPermutations(target: ITarget): TVector {
    return this.getPermutationMatrix(target).map(vector => vector.reduce((acc, point) => acc + point, 0));
  }

  getPermutationMatrix(target: ITarget): TMatrix {
    const { attacks, damage } = this.profile;
    const { hit, crit } = damage;
    const rollVector = D6.getRollVector();
    const rollTarget = this.getRollTarget(target);
    const resultVector = rollVector.map(roll => {
      if (roll === 6) return crit;
      if (roll >= rollTarget) return hit;
      return 0;
    });
    return generatePermutations(resultVector, attacks);
  }

  getDicePermutationMatrix(): TMatrix {
    const { attacks } = this.profile;
    return generatePermutations(D6.getRollVector(), attacks);
  }

  getRollTarget(target: ITarget): number {
    const { strength } = this.profile;
    const { toughness } = target;
    if (strength > toughness) return 3;
    if (strength === toughness) return 4;
    return 5;
  }
}

export default Fighter;